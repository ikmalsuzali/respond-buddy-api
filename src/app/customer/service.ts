// @ts-nocheck
import { prisma } from "../../prisma";

// get customer information from prisma where customer_id == customerId and workspace_id == workspaceId and integration_type = integrationType and userIdentity matches to the string field  email or user_aliases values

export const getCustomer = async ({
  userIdentity,
}: {
  userIdentity: string;
}) => {
  const customer = await prisma.customers.findFirst({
    where: {
      OR: [
        { user: { equals: userIdentity } },
        { random_user_id: { equals: userIdentity } },
        // {
        //   user_alias: {
        //     path: ["username"],
        //     string_contains: userIdentity,
        //   },
        // },
      ],
    },
  });

  return customer;
};

export const saveCustomer = async ({
  workspaceId,
  userId,
  type,
  metadata,
  randomUserId,
}: {
  email: string;
  workspaceId: string;
  userId: string;
  type?: string;
  metadata?: any | null | undefined;
  randomUserId?: string;
}) => {
  const data = {};

  if (workspaceId) {
    data.workspace = workspaceId;
  }

  if (userId) {
    data.user = userId;
  }

  if (randomUserId) {
    data.random_user_id = randomUserId;
  }

  // @ts-nocheck
  const customer = await prisma.customers.create({
    data: data,
  });

  if (!customer) throw new Error("Unable to create customer");

  return customer;
};

export const getSlackCustomer = async ({ userInfo }: { userInfo: any }) => {
  return {
    email: userInfo?.user?.profile?.email,
    slack_id: userInfo?.user?.id,
    slack_username: userInfo?.user?.name,
  };
};
