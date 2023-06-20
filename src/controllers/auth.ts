// @ts-nocheck
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { decryptJwt, isValidEmail } from "../helpers";
import { prisma } from "../prisma";
import "../helpers/bigInt.js";
import { addMetadataToToken, getValidEmails } from "../helpers/index";

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
        username,
        workspace_name,
        workspace_email,
        workspace_description,
      } = request.body || {};

      if (password !== confirm_password) {
        throw new Error("Passwords do not match");
      }

      if (!isValidEmail(email)) throw new Error("Invalid email");

      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!user) throw new Error("User already created");

      // Create prisma user if not exists
      let publicUser = null;
      publicUser = await prisma.users.findFirst({
        where: {
          email: user?.email,
          user_id: user?.id,
        },
      });

      if (publicUser) throw new Error("User already created");

      if (!publicUser) {
        publicUser = await prisma.users.create({
          data: {
            username: username || user?.email,
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
          name: workspace_name,
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
        session: token,
      });
    }
  );

  fastify.post(
    "/login/facebook",
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
    "/login/google",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { access_token } = request.body;

      if (!access_token) {
        reply.badRequest("Missing access token");
        return;
      }

      try {
        const { user, session, error } = await supabase.auth.signIn({
          provider: "google",
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
}
