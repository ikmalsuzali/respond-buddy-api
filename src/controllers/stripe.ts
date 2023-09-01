// @ts-nocheck
import { FastifyReply } from "fastify";
import { FastifyInstance, FastifyRequest } from "fastify";
import Stripe from "stripe";
import { prisma } from "../prisma";
import "../helpers/bigInt.js";
import { logger } from "../main";

export function stripeRoutes(fastify: FastifyInstance) {
  const stripeEndpoint =
    fastify?.config.ENVIRONMENT == "production"
      ? fastify?.config.STRIPE_WEBHOOK_LIVE
      : fastify?.config.STRIPE_WEBHOOK_DEMO;

  const stripeSecret =
    fastify?.config.ENVIRONMENT == "production"
      ? fastify?.config.STRIPE_SECRET_LIVE
      : fastify?.config.STRIPE_SECRET_DEMO;

  const enviroment = fastify?.config.ENVIRONMENT;

  const stripeClient = new Stripe(stripeSecret, {
    apiVersion: "2023-08-16",
  });

  type checkoutSessionRequestType = {
    price_id: string;
    user_id: string;
  };

  fastify.get("/api/v1/stripe/products", async (request, reply) => {
    console.log("env", enviroment);
    let products = await prisma.stripe_products.findMany({
      where: {
        env: fastify?.config.ENVIRONMENT == "production" ? "live" : "demo",
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
      let { plan_id, url, additional_prices = [] } = request.body;

      console.log("url", url);
      console.log("🚀 ~ file: stripe.ts:48 ~ price_id:", plan_id);

      try {
        let payment = await getFirstPaymentSuccess(
          request?.token_metadata?.custom_metadata?.workspace_id
        );
        if (payment) {
          return reply
            .status(400)
            .send({ message: "Payment has been made already" });
        }

        let paymentResponse = null;

        let stripeProduct = await prisma.stripe_products.findFirst({
          where: {
            stripe_price_id: plan_id,
          },
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
        case "payment_intent.succeeded":
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
    logger.info({ type: "paymentIntent", data: paymentIntent });
    // CHECK IF THE PAYMENT INTENT status key is success or failed
    try {
      await prisma.payments.update({
        where: {
          id: paymentIntent?.metadata?.client_reference_id,
        },
        data: {
          status: 1,
          stripe_payment_intent_id: paymentIntent?.id,
          receipt_url: paymentIntent?.charges?.data[0].receipt_url,
        },
      });

      // Delete all older subscriptions
      await prisma.subscriptions.updateMany({
        where: {
          workspace: paymentIntent?.metadata?.workspace_id,
        },
        data: {
          is_deleted: true,
        },
      });

      await prisma.subscriptions.create({
        data: {
          workspace: paymentIntent?.metadata?.workspace_id,
          stripe_product: paymentIntent?.metadata?.stripe_product_id,
        },
      });
    } catch (error) {
      logger.error({ type: "paymentIntent", data: error });
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
