import { prisma } from "../../prisma";

// export const createWorkspace = async (fastify, attrs) => {
//   const { name, email, description } = attrs;
//   const { workspace, error } = await fastify.prisma.workspace.create({
//     data: {
//       name,
//       email,
//       description,
//     },
//   });

//   if (error) {
//     throw error;
//   }

//   return { workspace };
// };

// // Update workspace
// export const updateWorkspace = async (fastify, attrs) => {
//   const { id, name, description, active } = attrs;
//   const { workspace, error } = await fastify.prisma.workspace.update({
//     where: {
//       id: id,
//     },
//     data: {
//       name,
//       description,
//       active,
//     },
//   });

//   if (error) {
//     throw error;
//   }

//   return { workspace };
// };

// // Delete workspace
// export const deleteWorkspace = async (fastify, attrs) => {
//   const { id } = attrs;
//   const { workspace, error } = await fastify.prisma.workspace.delete({
//     where: {
//       id: id,
//     },
//   });

//   if (error) {
//     throw error;
//   }

//   return { workspace };
// };

// // Get workspace by id
// export const getWorkspace = async (fastify, attrs) => {
//   const { id } = attrs;
//   const { workspace, error } = await fastify.prisma.workspace.findUnique({
//     where: {
//       id: id,
//     },
//   });

//   if (error) {
//     throw error;
//   }

//   return { workspace };
// };

export const getTimeTillNextCreditRenewal = (subscription: any) => {
  const now = new Date();
  const createdAt = new Date(subscription.created_at);

  // Adjust the month of createdAt to the next month
  createdAt.setMonth(createdAt.getMonth() + 1);

  // Calculate the difference in time
  const timeDiff = createdAt.getTime() - now.getTime();

  // Return the difference in various units
  return {
    milliseconds: timeDiff,
    seconds: Math.floor(timeDiff / 1000),
    minutes: Math.floor(timeDiff / (1000 * 60)),
    hours: Math.floor(timeDiff / (1000 * 60 * 60)),
    days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
  };
};

export const getNextRenewalDate = (subscription: any) => {
  const createdAt = new Date(subscription.created_at);

  // Check the plan_type and adjust the date accordingly
  switch (subscription.stripe_products?.plan_type) {
    case "ALL":
      createdAt.setFullYear(createdAt.getFullYear() + 1);
      break;
    case "YEARLY":
      createdAt.setFullYear(createdAt.getFullYear() + 1);
      break;
    case "MONTHLY":
      createdAt.setMonth(createdAt.getMonth() + 1);
      break;
    // Add cases for other types if needed
    default:
      throw new Error("Unknown plan_type");
  }

  return createdAt.toISOString();
};

export const getAllUserWorkspaces = async (fastify: any, attrs: any) => {
  const { integration_name } = attrs;
  const user_workspaces = await prisma.workspace_integrations.findMany({
    where: {
      integrations: {
        name: integration_name,
      },
      is_deleted: false,
    },
    include: {
      integrations: true,
    },
  });
  console.log(
    "🚀 ~ file: service.ts:85 ~ getAllUserWorkspaces ~ user_workspaces:",
    user_workspaces
  );
  return user_workspaces || [];
};
