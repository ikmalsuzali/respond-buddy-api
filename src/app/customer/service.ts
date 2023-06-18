// @ts-nocheck

import { type } from "os";
import { isEmail, isUsernameOrRealName } from "../../helpers";
import { prisma } from "../../prisma";

// get customer information from prisma where customer_id == customerId and workspace_id == workspaceId and integration_type = integrationType and userIdentity matches to the string field  email or user_aliases values

export const getCustomer = async ({
  workspaceIntegrationId,
  userIdentity,
}: {
  workspaceIntegrationId: string;
  userIdentity: string;
}) => {
  const customer = await prisma.customers.findFirst({
    where: {
      workspace_integration: workspaceIntegrationId,
      OR: [
        { email: { equals: userIdentity } },
        {
          user_alias: {
            path: ["username"],
            string_contains: userIdentity,
          },
        },
      ],
    },
  });

  return customer;
};

// export const saveCustomer = async ({
//   email,
//   workspace,
//   metadata,
// }: {
//   email: string;
//   workspace: string;
//   metadata?: any | null | undefined;
// }) => {
//   // @ts-nocheck
//   const customer = await prisma.customers.create({
//     data: {
//       email,
//       workspace,
//       metadata: {
//         ...metadata,
//         slack_id: metadata?.user?.id,
//         slack_username: metadata?.user?.name,
//       },
//     },
//   });

//   if (!customer) throw new Error("Unable to create customer");

//   return customer;
// };

export const getSlackCustomer = async ({ userInfo }: { userInfo: any }) => {
  return {
    email: userInfo?.user?.profile?.email,
    slack_id: userInfo?.user?.id,
    slack_username: userInfo?.user?.name,
  };
};
