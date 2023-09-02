// @ts-nocheck
import { FastifyReply } from "fastify";
import { FastifyInstance, FastifyRequest } from "fastify";
import Stripe from "stripe";
import { prisma } from "../prisma";
import "../helpers/bigInt.js";
import { logger } from "../main";
import { getAddOnCreditsTillNextSubscriptionRenewal } from "../app/userWorkspaces/service";

export function stripeRoutes(fastify: FastifyInstance) {
  const enviroment = fastify?.config.ENVIRONMENT;

  const stripeEndpoint =
    enviroment == "production"
      ? fastify?.config.STRIPE_WEBHOOK_LIVE
      : fastify?.config.STRIPE_WEBHOOK_DEMO;

  const stripeSecret =
    enviroment == "production"
      ? fastify?.config.STRIPE_SECRET_LIVE
      : fastify?.config.STRIPE_SECRET_DEMO;

  const stripeClient = new Stripe(stripeSecret, {
    apiVersion: "2023-08-16",
  });

  type checkoutSessionRequestType = {
    price_id: string;
    user_id: string;
  };

  fastify.get("/api/v1/stripe/products", async (request, reply) => {
    let products = await prisma.stripe_products.findMany({
      where: {
        env: enviroment == "production" ? "live" : "demo",
      },
      orderBy: {
        order: "asc",
      },
    });
    return reply.send(products);
  });

  fastify.post(
    "/api/v1/checkout-session",
    async (request: FastifyRequest, reply: FastifyReply) => {
      let { plan_id, url, remarks = "", additional_prices = [] } = request.body;

      if (!plan_id) reply.status(400).send({ message: "No plan found" });

      console.log("url", url);
      console.log("🚀 ~ file: stripe.ts:48 ~ price_id:", plan_id);

      try {
        let paymentResponse = null;

        let stripeProduct = await prisma.stripe_products.findFirst({
          where: {
            stripe_price_id: plan_id,
          },
          include: {
            subscriptions: {
              where: {
                is_deleted: false,
              },
            },
          },
        });

        if (plan_id == "free") {
          // Find all subscriptions for the workspace
          const subscriptions = await prisma.subscriptions.findMany({
            where: {
              workspace: request?.token_metadata?.custom_metadata?.workspace_id,
              is_deleted: false,
            },
          });

          // Delete all stripe subscriptions
          if (subscriptions.length > 0) {
            let stripeSubscriptions = subscriptions.filter(
              (subscription) => subscription.stripe_subscription_id !== null
            );

            for (const subscription of stripeSubscriptions) {
              const stripeSubscription =
                await stripeClient.subscriptions.retrieve(
                  subscription.stripe_subscription_id
                );
              if (
                stripeSubscription &&
                stripeSubscription.status !== "canceled"
              ) {
                stripeClient.subscriptions.del(
                  subscription.stripe_subscription_id
                );
              }
            }
          }

          // Find current subscription and update the remarks
          const currentSubscription = subscriptions?.find(
            (subscription) => subscription.is_deleted == false
          );
          if (currentSubscription) {
            const updatedSubscription = await prisma.subscriptions.update({
              where: {
                id: currentSubscription.id,
              },
              data: {
                remarks: remarks,
              },
              include: {
                stripe_products: true,
                workspaces: true,
              },
            });

            const updateCredits = await prisma.workspaces.update({
              where: {
                id: request?.token_metadata?.custom_metadata?.workspace_id,
              },
              data: {
                credit_addon_count: {
                  increment: getAddOnCreditsTillNextSubscriptionRenewal(
                    updatedSubscription,
                    updatedSubscription?.stripe_products
                  ),
                },
                credit_count:
                  updatedSubscription?.stripe_products?.meta?.renewal?.monthly
                    ?.credit || 100,
              },
            });
          }

          // Delete all subscriptions

          const deletedSubscription = await prisma.subscriptions.updateMany({
            where: {
              workspace: request?.token_metadata?.custom_metadata?.workspace_id,
            },
            data: {
              is_deleted: true,
            },
          });

          // Create new subscription
          const newSubscription = await prisma.subscriptions.create({
            data: {
              workspace: request?.token_metadata?.custom_metadata?.workspace_id,
              stripe_product: stripeProduct?.id,
              is_deleted: false,
            },
          });

          reply.send({
            message: "Successfully downgraded",
            stripe_url: `${url}/apps/pricings`,
          });
        }

        console.log(stripeProduct);

        if (stripeProduct && stripeProduct.subscriptions.length > 0)
          return reply.status(400).send({
            message:
              "You are already on the current subscription, you can always move up to a higher plan",
          });

        if (!stripeProduct)
          return reply.status(400).send({ message: "No stripe product found" });

        paymentResponse = await prisma.payments.create({
          data: {
            workspace: request?.token_metadata?.custom_metadata?.workspace_id,
            user: request?.token_metadata?.custom_metadata?.user_id,
            quantity: stripeProduct.quantity,
            stripe_product: stripeProduct?.id,
          },
        });

        let user = await prisma.users.findUnique({
          where: {
            id: request?.token_metadata?.custom_metadata?.user_id,
          },
        });

        const session = await stripeClient.checkout.sessions.create({
          line_items: [
            {
              price: stripeProduct.stripe_price_id,
              quantity: stripeProduct.quantity,
            },
          ],
          allow_promotion_codes: true,
          automatic_tax: {
            enabled: true,
          },
          // add_invoice_items: additional_prices,
          subscription_data: {
            metadata: {
              client_reference_id: paymentResponse?.id,
              user_id: request?.token_metadata?.custom_metadata?.user_id,
              workspace_id:
                request?.token_metadata?.custom_metadata.workspace_id,
              db_stripe_product_id: stripeProduct?.id,
            },
          },
          client_reference_id: paymentResponse?.id,
          customer_email: user?.email!,
          mode: "subscription",
          custom_text: {
            submit: {
              message: `${stripeProduct?.name} - ${stripeProduct?.description} (${stripeProduct?.plan_type})`,
            },
          },
          metadata: {
            client_reference_id: stripeProduct?.id,
            stripe_product_id: plan_id,
            workspace_id:
              request?.token_metadata?.custom_metadata?.workspace_id,
            user_id: request?.token_metadata?.custom_metadata?.user_id,
          },
          success_url: `${url}/payment/${paymentResponse.id}/process`,
          cancel_url: `${url}/payment/${paymentResponse.id}/process`,
        });

        return reply.send({ stripe_url: session.url });
      } catch (error) {
        console.log(error);
        return reply.status(500).send(error);
      }
    }
  );

  fastify.post(
    "/api/v1/stripe-hook",
    async (request: FastifyRequest, reply: FastifyReply) => {
      let event = request.body;

      if (stripeEndpoint) {
        const signature = request.headers["stripe-signature"];

        try {
          event = stripeClient.webhooks.constructEvent(
            request.rawBody,
            signature,
            stripeEndpoint
          );
        } catch (err) {
          request.log.error({ type: "stripe-webhook", data: err });
          console.log(`⚠️  Webhook signature verification failed.`, err);
          return reply.status(400);
        }
      }

      const paymentIntent = event?.data.object;

      switch (event?.type) {
        case "invoice.payment_succeeded":
          // Then define and call a method to handle the successful payment intent.
          await handlePaymentIntentSucceeded(paymentIntent);
          break;
        case "checkout.session.expired":
          await handlePaymentIntentFailed(paymentIntent);
        case "payment_intent.payment_failed":
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          await handlePaymentIntentFailed(paymentMethod);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
          request.log.error({ type: "stripe-webhook", data: event });
      }

      return reply.send("success");
    }
  );

  fastify.get(
    "/api/v1/payment/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      let payment = await prisma.payments.findUnique({
        where: {
          id: request.params.id,
        },
        include: {
          stripe_products: true,
        },
      });

      return reply.send(payment);
    }
  );

  const handlePaymentIntentSucceeded = async (paymentIntent) => {
    // CHECK IF THE PAYMENT INTENT status key is success or failed
    try {
      console.log("payment successful intent");

      // Delete all older subscriptions
      const deletedSubscription = await prisma.subscriptions.updateMany({
        where: {
          workspace: paymentIntent?.subscription_details.metadata?.workspace_id,
        },
        data: {
          is_deleted: true,
        },
      });
      console.log(
        "🚀 ~ file: stripe.ts:220 ~ handlePaymentIntentSucceeded ~ subscription:",
        deletedSubscription
      );

      const subscribedProducts = await prisma.subscriptions.findMany({
        where: {
          workspace: paymentIntent?.subscription_details.metadata?.workspace_id,
          stripe_subscription_id: {
            not: null,
          },
        },
      });

      if (subscribedProducts.length > 0) {
        for (const subscription of subscribedProducts) {
          const stripeSubscription = await stripeClient.subscriptions.retrieve(
            subscription.stripe_subscription_id
          );
          if (stripeSubscription && stripeSubscription.status !== "canceled") {
            stripeClient.subscriptions.del(subscription.stripe_subscription_id);
          }
        }
      }

      const subscription = await prisma.subscriptions.create({
        data: {
          workspace:
            paymentIntent?.subscription_details?.metadata?.workspace_id,
          stripe_subscription_id: paymentIntent?.subscription,
          stripe_product:
            paymentIntent?.subscription_details?.metadata?.db_stripe_product_id,
          is_deleted: false,
        },
        include: {
          stripe_products: true,
          workspaces: true,
        },
      });

      const updateCredits = await prisma.workspaces.update({
        where: {
          id: paymentIntent?.subscription_details?.metadata?.workspace_id,
        },
        data: {
          credit_addon_count: {
            increment:
              getAddOnCreditsTillNextSubscriptionRenewal(
                subscription,
                subscription?.stripe_products
              ) || 0,
          },
          credit_count:
            subscription?.stripe_products?.meta?.renewal?.monthly || 100,
        },
      });

      const payment = await prisma.payments.update({
        where: {
          id: paymentIntent?.subscription_details?.metadata
            ?.client_reference_id,
        },
        data: {
          status: 1,
          stripe_payment_intent_id: paymentIntent?.id,
          receipt_url: paymentIntent?.hosted_invoice_url,
        },
      });
    } catch (error) {
      console.log("337: webhook error", error);
    }
  };

  const handlePaymentIntentFailed = async (paymentIntent) => {
    const paymentIntentId =
      paymentIntent.payment_intent || paymentIntent.id || "";
    if (paymentIntentId) {
      await prisma.payments.update({
        where: {
          id: paymentIntent?.metadata?.client_reference_id,
        },
        data: {
          status: 2,
          stripe_payment_intent_id: paymentIntentId,
        },
      });
    }
  };

  const getFirstPaymentSuccess = async (workspaceId) => {
    const payment = await prisma.payments.findFirst({
      where: {
        workspace: workspaceId,
        status: 1,
      },
    });

    return payment;
  };

  // const createStripeCustomer = async (customer: string) => {
  //   const customerResponse = await stripeClient.customers.create({
  //     email: customer,
  //   });

  //   return customerResponse;
  // };

  // const getCustomerById = async (customerId: string) => {
  //   const customer = await stripeClient.customers.retrieve(customerId);

  //   return customer;
  // };

  // const deleteSubscription = async (subscriptionId: string) => {
  //   const deletedSubscription = await stripeClient.subscriptions.del(
  //     subscriptionId
  //   );

  //   return deletedSubscription;
  // };
}
