import { isEmail, isUsernameOrRealName } from "../../helpers";
import { prisma } from "../../prisma";

// get customer information from prisma where customer_id == customerId and workspace_id == workspaceId and integration_type = integrationType and userIdentity matches to the string field  email or user_aliases values

export const getCustomer = async (
  workspaceIntegrationId: string,
  userIdentity: string
) => {
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

export const saveCustomer = async (
  userIdentity: string,
  workspaceIntegrationId: string
) => {
  // Check if userIdentity is email or user_alias
  let data = {
    workspace_integration: workspaceIntegrationId,
    user_alias: userIdentity,
  };
  // Check if userIdentity is an email using regex
  if (isEmail(userIdentity)) {
    data = {
      ...data,
      ...{ email: userIdentity },
    };
  } else if (isUsernameOrRealName(userIdentity) === "username") {
    let userAliasJson = JSON.stringify({
      username: userIdentity,
    });

    data = {
      ...data,
      ...{ user_alias: userAliasJson },
    };
  } else if (isUsernameOrRealName(userIdentity) === "real_name") {
    let userAliasJson = JSON.stringify({
      full_name: userIdentity,
    });

    data = {
      ...data,
      ...{ user_alias: userAliasJson },
    };
  }

  const customer = await prisma.customers.create({
    data,
  });

  if (!customer) throw new Error("Unable to create customer");

  return customer;
};
