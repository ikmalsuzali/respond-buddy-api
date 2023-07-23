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
