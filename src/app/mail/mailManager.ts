// @ts-nocheck
import { decrypt } from "../../helpers";
import { validateEmailConnection } from "./service";
import { eventManager } from "../../main";
const Imap = require("node-imap");
const EventEmitter = require("events");
const SpamScanner = require("spamscanner");
const { simpleParser } = require("mailparser");
const scanner = new SpamScanner();

class MailListenerManager extends EventEmitter {
  constructor() {
    super();
    this.clients = new Map();
  }

  init(workspaceIntegrations) {
    workspaceIntegrations.forEach((workspaceIntegration) => {
      const clientData = {
        host: workspaceIntegration.metadata.host,
        port: workspaceIntegration.metadata.imap_port,
        user: workspaceIntegration.metadata.email,
        password: decrypt(workspaceIntegration.metadata.password),
        tls: workspaceIntegration.metadata.tls,
        workspace_integration_id: workspaceIntegration.id,
      };

      if (validateEmailConnection(clientData)) {
        this.addClient(clientData);
      }
    });

    const clients = this.getClientList();
    console.log("connected clients", clients);
  }

  addClient({
    host,
    port,
    user,
    password,
    tls,
    workspace_integration_id,
  }: {
    host: string;
    port: number;
    user: string;
    password: string;
    tls: boolean;
  }) {
    const client = new Imap({
      user: user,
      password: password,
      host: host,
      port: port,
      tls: tls,
      workspace_integration_id,
      // tlsOptions: { rejectUnauthorized: false },
      // markSeen: false,
      // attachments: false,
      // mailbox: "INBOX",
    });

    client.once("ready", () => {
      client.openBox("INBOX", true, (err, box) => {
        if (err) throw err;

        client.on("mail", function (numNewMail) {
          const fetch = client.seq.fetch(
            `${box.messages.total - numNewMail + 1}:${box.messages.total}`,
            { bodies: [""] }
          );
          console.log(
            "🚀 ~ file: mailListener.ts:48 ~ MailListenerManager ~ fetch:",
            fetch
          );
          fetch.on("message", function (msg) {
            let emailHeader = "";
            let emailBody = "";

            msg.on("body", async (stream, info) => {
              if (info.which === "HEADER") {
                stream.on("data", (chunk) => {
                  emailHeader += chunk.toString();
                });
              } else {
                stream.on("data", (chunk) => {
                  emailBody += chunk.toString();
                });
              }
            });

            msg.once("end", async () => {
              try {
                const parsedHeader = await simpleParser(emailHeader);
                const parsedBody = await simpleParser(emailBody);
                // const spamResult = await scanner.scan(parsedBody.text);

                const emailData = {
                  header: parsedHeader,
                  subject: parsedHeader.subject,
                  cc: parsedHeader.cc,
                  body: parsedBody.text || parsedBody.html,
                };

                console.log(client, client.workspace_integration_id);

                // if (spamResult.is_spam) throw new Error("Email is spam");

                if (client && parsedBody?.text) {
                  eventManager.emit("workflow", {
                    workspace_integration_id: workspace_integration_id,
                    message: parsedBody.text,
                    data: emailData,
                  });
                }

                // Process the email object as needed
                console.log(emailData);
              } catch (error) {
                console.error("Failed to parse the email:", error);
              }
            });
          });
        });
      });
    });

    client.once("error", function (err) {
      console.log(err);
    });

    client.once("end", function () {
      console.log("Connection ended");
    });

    client.connect();
    this.clients.set(user, client);
    // console.log("from", from);
    // const isSpam = await scanner.scan(latestEmail.text);
    // if (isSpam) {
    //   console.log("Received non-spam email:", mail.subject);

    //   console.log(
    //     "🚀 ~ file: mailListener.ts:20 ~ MailListenerManager ~ mailListener.on ~ mail:",
    //     mail
    //   );
    // } else {
    //   this.emit("mail", { user, mail });

    //   console.log("Received non-spam email:", mail.subject);
    // }
  }

  removeClient(username) {
    const client = this.clients.get(username);
    if (client) {
      client.end();
      this.clients.delete(username);
      console.log(`Disconnected from ${username}`);
    }
  }

  closeAllClients() {
    for (const [username, client] of this.clients.entries()) {
      client.end();
      console.log(`Disconnected from ${username}`);
    }
    this.clients.clear();
  }

  getClientList() {
    return Array.from(this.clients.keys());
  }
}

const handleNewEmail = async (client, stream) => {
  // const parser = new MailParser();
  if (!stream || typeof stream.pipe !== "function") {
    throw new Error(
      "Invalid stream: The provided object is not a readable stream."
    );
  }
  const parsedData = await simpleParser(stream, {});
  if (!parsedData) throw new Error("Unable to parse email");
  const spamResult = await scanner.scan(parsedData.text);

  if (spamResult?.is_spam) {
    throw new Error("Email is spam");
  }

  console.log(parsedData);

  if (client && parsedData?.text) {
    eventManager.emit("workflow", {
      workflow_integration_id: client.workspace_integration_id,
      message: parsedData.text,
      data: parsedData,
    });
  }
  // stream.pipe(parser);
  // parser.on("headers", function (headers) {
  //   console.log("Email subject: ", headers?.get("subject"));
  //   console.log("Email sender: ", headers?.get("from").text);
  //   consiole.log("Email recipient: ", headers?.get("to").text);
  //   console.log(
  //     "Email CC: ",
  //     headers?.get("cc") ? headers?.get("cc").text : ""
  //   );
  // });
  // parser.on("data", function (mail) {
  //   console.log("🚀 ~ file: mailListener.ts:123 ~ mail:", mail);
  // });
};

export default MailListenerManager;
