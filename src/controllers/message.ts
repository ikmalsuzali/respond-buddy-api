import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { eventManager } from "../main";
import { triggerWorkflow } from "../app/workflow/service";
import { getCustomer, saveCustomer } from "../app/customer/service";
import { getWorkspaceTags } from "../app/tags/service";
import { getWorkspaceIntegration } from "../app/workspaceIntegration/service";
import { tagSearch } from "../app/gpt/service";

export function messageEvents(fastify: FastifyInstance) {
  eventManager.on("workflow", async (data: any) => {
    // Get/Save customer information
    const customer = await getCustomer(
      data.workspace_integration_id,
      data.data
    );
    if (!customer) {
      // Save customer
      await saveCustomer(data.data, data.workspace_integration_id);
    }
    // Save customer message

    // thoughts
    // 1. Store the docs (store)
    // 2. Convert into a vector
    // 3. Attach a tag to the stored vector

    // Upon message received:
    // 1. Get the tags related
    const workspaceIntegration = await getWorkspaceIntegration(
      data.workspace_integration_id
    );
    const allWorkspaceAndSystemTags = await getWorkspaceTags(
      workspaceIntegration?.id
    );
    // 2. Categorize the prompt
    const matchedTags = tagSearch(allWorkspaceAndSystemTags, data.message);
    // 3. Get the vector stores related
    // 4. Search for the similarities in the vector stores

    // 5. Get response template from tags
    // 6. If no response template, create a response
    // 7. If tag has response template, use that along with the vector store response

    // Message received
    // 1. Find the username, email, and other details related to the user
    // 2. If user is found, get the messages related to the user
    // 3. If user is not found, create a new user, and create the message

    triggerWorkflow(data);

    // Save response message
    // Follow rules to send message
  });
}

export function messageRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/v1/message",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body;
    }
  );
}
