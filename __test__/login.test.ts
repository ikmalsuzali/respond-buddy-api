import Fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { MockProxy, mock } from "jest-mock-extended";
import { authRoutes } from "../src/controllers/auth"; // Replace this with the actual path to your login route
import { isValidEmail, addMetadataToToken } from "../src/helpers/index"; // Replace this with the actual path to your utility functions

let fastify: FastifyInstance;
let prismaMock: MockProxy<PrismaClient>;
const prisma = new PrismaClient();

beforeEach(() => {
  prismaMock = mock<PrismaClient>();
  const supabaseMock = {
    auth: {
      signIn: jest.fn().mockImplementation(async () => ({
        user: { id: "test-user-id" },
        session: { access_token: "test-access-token" },
        error: null,
      })),
    },
  };

  fastify = Fastify();
  fastify.decorate("prisma", prismaMock);
  fastify.decorate("supabase", supabaseMock);
  fastify.register(authRoutes);
});

afterEach(() => {
  fastify.close();
});

test("Login with valid credentials", async () => {
  const email = "test@example.com";
  const password = "test_password";
  const testUserId = "test-user-id";
  const testWorkspaceId = "test-workspace-id";

  prismaMock.users.findFirst.mockResolvedValue({
    id: testUserId,
    user_id: testUserId,
    email,
    first_name: "Test",
    last_name: "User",
  });

  // jest.spyOn(prisma.users, "findFirst").mockResolvedValue({
  //   id: testUserId,
  //   user_id: testUserId,
  //   email,
  //   first_name: "Test",
  //   last_name: "User",
  // });

  // jest.spyOn(prisma.users, "findFirst").mockImplementation(async () => ({
  //   id: testUserId,
  //   user_id: testUserId,
  //   email,
  //   first_name: "Test",
  //   last_name: "User",
  // }));

  // prismaMock.users.findFirst.mockImplementation(async () => ({
  //   id: testUserId,
  //   user_id: testUserId,
  //   email,
  //   first_name: "Test",
  //   last_name: "User",
  // }));

  // prismaMock.user_workspaces.findMany.mockImplementation(async () => [
  //   {
  //     id: testWorkspaceId,
  //     user: testUserId,
  //     workspace: testWorkspaceId,
  //     workspaces: {
  //       id: testWorkspaceId,
  //       name: "Test Workspace",
  //     },
  //   },
  // ]);

  const response = await fastify.inject({
    method: "POST",
    url: "/api/v1/login",
    payload: { email, password },
  });

  expect(response.statusCode).toBe(200);
  const jsonResponse = JSON.parse(response.body);
  expect(jsonResponse.user).toBeDefined();
  expect(jsonResponse.session).toBeDefined();
  expect(jsonResponse.user_workspace).toBeDefined();

  expect(prismaMock.users.findFirst).toHaveBeenCalledWith({
    where: { user_id: testUserId },
  });

  expect(prismaMock.user_workspaces.findMany).toHaveBeenCalledWith({
    where: { users: { id: testUserId } },
    include: { workspaces: true },
  });
});

// Add the other test cases as shown in the previous response, updating the tests to use prismaMock and supabaseMock.
