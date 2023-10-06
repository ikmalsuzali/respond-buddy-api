// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { decryptJwt, isValidEmail } from "../helpers";
import { prisma } from "../prisma";
import "../helpers/bigInt.js";
import {
  addMetadataToToken,
  getValidEmails,
  getHighLevelObject,
} from "../helpers/index";
import {
  getNextRenewalDate,
  getTimeTillNextCreditRenewal,
} from "../app/userWorkspaces/service";

export function authRoutes(fastify: FastifyInstance) {
  const { supabase } = fastify;

  // Write function for supabase Login
  fastify.post(
    "/api/v1/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = request.body || {};

      try {
        if (!isValidEmail(email)) throw new Error("Invalid email");
        if (!password) throw new Error("Password is required");

        const { user, session, error } = await supabase.auth.signIn({
          email,
          password,
        });

        const publicUser = await prisma.users.findFirst({
          where: {
            user_id: user?.id,
          },
        });

        if (!publicUser) return new Error("User not found");

        const userWorkspace = await prisma.user_workspaces.findMany({
          where: {
            users: {
              id: publicUser?.id,
            },
          },
          include: {
            workspaces: true,
          },
        });

        if (userWorkspace.length === 0) new Error("Workspace not found");

        if (error) {
          throw error;
        }

        const token = addMetadataToToken(
          session?.access_token,
          fastify?.config.JWT_SECRET,
          {
            workspace_id: userWorkspace[0]?.workspaces?.id,
            user_id: publicUser?.id,
          }
        );

        reply.code(200).send({
          user: publicUser,
          session: token,
          user_workspace: userWorkspace[0],
        });
      } catch (err) {
        reply.badRequest(err.message);
      }
    }
  );
  // Write function for supabase signup
  fastify.post(
    "/api/v1/signup",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        email,
        password,
        confirm_password,
        // username,
        workspace_name,
        workspace_email,
        workspace_description,
      } = request.body || {};

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (password !== confirm_password) {
        throw new Error("Passwords do not match");
      }

      if (!isValidEmail(email)) throw new Error("Invalid email");

      const checkUniqueEmail = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (checkUniqueEmail) return new Error("Email already exists");

      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!user) throw new Error("User already created");

      // Create prisma user if not exists
      let publicUser = await prisma.users.findFirst({
        where: {
          email: user?.email,
          user_id: user?.id,
        },
      });

      if (publicUser) throw new Error("User already created");

      if (!publicUser) {
        publicUser = await prisma.users.create({
          data: {
            username: user?.email,
            email: user?.email,
            user_id: user?.id,
          },
        });
      }

      if (error) {
        throw new Error(error.message);
      }

      const workspace = await prisma.workspaces.create({
        data: {
          name: workspace_name || "Personal Workspace",
          email: workspace_email || email,
          description: workspace_description || "",
        },
      });

      const userWorkspace = await prisma.user_workspaces.create({
        data: {
          user: publicUser?.id,
          workspace: workspace?.id,
        },
        include: {
          workspaces: true,
        },
      });

      // Get free subscription
      const freeSubscription = await prisma.stripe_products.findFirst({
        where: {
          key: "free",
          env: fastify.config.ENVIRONMENT === "demo" ? "demo" : "prod",
        },
      });

      // Apply free subscription to workspace
      const workspaceSubscription = await prisma.subscriptions.create({
        data: {
          workspace: workspace?.id,
          stripe_product: freeSubscription?.id, // Free subscription
        },
        include: {
          stripe_products: true,
        },
      });

      // Set next renewal date
      workspaceSubscription.next_renewal_date = getNextRenewalDate(
        workspaceSubscription
      );

      workspaceSubscription.remaining_renewal_days =
        getTimeTillNextCreditRenewal(workspaceSubscription).days;

      await prisma.workspaces.update({
        where: {
          id: workspace?.id,
        },
        data: {
          credit_count:
            workspaceSubscription?.stripe_products?.meta?.renewal?.monthly,
        },
      });

      const token = addMetadataToToken(
        session?.access_token,
        fastify?.config.JWT_SECRET,
        {
          workspace_id: workspace?.id,
          user_id: publicUser?.id,
        }
      );

      reply.code(200).send({
        user,
        user_workspace: userWorkspace,
        subscription: workspaceSubscription,
        session: token,
      });
    }
  );

  fastify.post(
    "/api/v1/login/facebook",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { access_token } = request.body;

      if (!access_token) {
        reply.badRequest("Missing access token");
        return;
      }

      try {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "facebook",
          access_token,
        });

        if (error) {
          throw error;
        }

        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send({ user, session });
      } catch (err) {
        reply.badRequest(err.message);
      }
    }
  );

  fastify.post(
    "/api/v1/login/oauth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const decodedPayload = decryptJwt(request.headers.authorization);

      try {
        // find user by email
        const foundUser = await prisma.users.findFirst({
          where: {
            email: decodedPayload?.email,
          },
          include: {
            user_workspaces: {
              include: {
                workspaces: {
                  include: {
                    subscriptions: true,
                  },
                },
              },
            },
          },
        });

        if (foundUser) {
          const token = addMetadataToToken(
            request.headers.authorization.split(" ")[1],
            fastify?.config.JWT_SECRET,
            {
              workspace_id: foundUser?.user_workspaces[0]?.workspace,
              user_id: foundUser?.id,
            }
          );

          const user = getHighLevelObject(foundUser);
          const userWorkspace = getHighLevelObject(
            foundUser.user_workspaces[0]
          );

          reply.code(200).send({
            user,
            user_workspace: userWorkspace,
            subscription:
              foundUser.user_workspaces[0].workspaces.subscriptions[0],
            session: token,
          });
        } else {
          // if no user create user
          const publicUser = await prisma.users.create({
            data: {
              email: decodedPayload?.email,
              user_id: decodedPayload?.sub,
              first_name: decodedPayload?.user_metadata?.name,
            },
          });

          const workspace = await prisma.workspaces.create({
            data: {
              name: "Personal Workspace",
              email: decodedPayload?.email,
            },
          });

          const userWorkspace = await prisma.user_workspaces.create({
            data: {
              user: publicUser?.id,
              workspace: workspace?.id,
            },
            include: {
              workspaces: true,
            },
          });

          // Get free subscription
          const freeSubscription = await prisma.stripe_products.findFirst({
            where: {
              key: "free",
              env: fastify.config.ENVIRONMENT === "demo" ? "demo" : "prod",
            },
          });

          const workspaceSubscription = await prisma.subscriptions.create({
            data: {
              workspace: workspace?.id,
              stripe_product: freeSubscription?.id, // Free subscription
            },
            include: {
              stripe_products: true,
            },
          });

          // Set next renewal date
          workspaceSubscription.next_renewal_date = getNextRenewalDate(
            workspaceSubscription
          );

          workspaceSubscription.remaining_renewal_days =
            getTimeTillNextCreditRenewal(workspaceSubscription).days;

          await prisma.workspaces.update({
            where: {
              id: workspace?.id,
            },
            data: {
              credit_count:
                workspaceSubscription?.stripe_products?.meta?.renewal?.monthly,
            },
          });

          const token = addMetadataToToken(
            request.headers.authorization.split(" ")[1],
            fastify?.config.JWT_SECRET,
            {
              workspace_id: workspace?.id,
              user_id: publicUser?.id,
            }
          );

          reply.code(200).send({
            user: publicUser,
            user_workspace: userWorkspace,
            subscription: workspaceSubscription,
            session: token,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  );

  fastify.post(
    "/api/v1/invite",
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log("request body", request.body);
      const { emails = [] } = request.body || {};
      if (emails.length === 0) throw new Error("No emails provided");

      const validEmails = getValidEmails(emails);

      let errors = [];
      for (const email of validEmails) {
        let { data, error } = await supabase.auth.api.inviteUserByEmail(email, {
          workspace_id: request?.token_metadata?.custom_metadata?.workspace_id,
        });

        if (error) {
          errors.push(error.message + " for email " + email);
        }
      }

      reply.code(200).send({ emails: validEmails, error: errors });
    }
  );

  // Update password
  // fastify.post(
  //   "/api/v1/update-password",
  //   async (request: FastifyRequest, reply: FastifyReply) => {
  //     const { current_password, password, confirm_password } =
  //       request.body || {};

  //     if (!current_password) throw new Error("Current password is required");
  //     if (!password) throw new Error("Password is required");
  //     if (!confirm_password) throw new Error("Confirm password is required");

  //     // check current password

  //     // Get user from Supabase by email
  //     const { data: user, error } = await supabase
  //       .from("users")
  //       .select("*")
  //       .eq("email", email)
  //       .single();

  //     if (error || !user) {
  //       return reply.status(400).send({ error: "User not found!" });
  //     }

  //     const isValidPassword = await bcrypt.compare(
  //       currentPassword,
  //       user.encrypted_password
  //     );
  //     if (!isValidPassword) {
  //       return reply.status(400).send({ error: "Invalid current password!" });
  //     }

  //     if (password !== confirm_password) {
  //       throw new Error("Passwords do not match");
  //     }

  //     const { user, session, error } = await supabase.auth.update({
  //       password,
  //     });

  //     if (error) {
  //       throw new Error(error.message);
  //     }

  //     reply.code(200).send({ user, session });
  //   }
  // );

  // Reset password
  fastify.post(
    "/api/v1/auth/reset-password",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await prisma.users.findUnique({
        where: {
          id: request?.token_metadata?.custom_metadata?.user_id,
        },
      });

      const { data, error } = await supabase.auth.api.resetPasswordForEmail(
        user?.email,
        { redirectTo: `${fastify.config.BASE_URL}/update-password` }
      );

      reply
        .code(200)
        .send({ data, message: "Email sent with password reset request" });
    }
  );
}
