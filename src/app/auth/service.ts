// @ts-nocheck

import { FastifyInstance, FastifyRequest } from "fastify";

export const signIn = async (fastify: FastifyInstance, attrs: any) => {
  const { email, password } = attrs;
  const { user, session, error } = await fastify.supabase.auth.signIn({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return { user, session };
};

export const signOut = async (fastify: FastifyInstance, attrs: any) => {
  const { email, password } = attrs;

  const { user, session, error } = await fastify.supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return { user, session };
};

export const signInWithProvider = async (fastify, attrs) => {
  const { provider } = attrs;
  const { user, session, error } = await fastify.supabase.auth.signIn({
    provider,
  });

  if (error) {
    throw error;
  }

  return { user, session };
};
