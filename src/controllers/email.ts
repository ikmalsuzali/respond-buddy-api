// server.js
const fastify = require("fastify")({ logger: true });
const MailListener = require("mail-listener4");
const nodemailer = require("nodemailer");

// Replace with your email credentials for multiple clients
// const clients = [
//   {
//     name: "Client 1",
//     emailConfig: {
//       user: "client1-email@example.com",
//       password: "client1-email-password",
//       host: "imap.example.com",
//       port: 993,
//       tls: true,
//       mailbox: "INBOX",
//     },
//     transporterConfig: {
//       host: "smtp.example.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "client1-email@example.com",
//         pass: "client1-email-password",
//       },
//     },
//   },
//   // ... more clients
// ];

const getWorkspaceIntegration = async () => {
  // Get workspace integration from prisma
  const workspace = await fastify.prisma.workspaceIntegration.findOne({
    where: {
      integration: {
        name: "Email",
      },
    },
    include: {
      integration: true,
    },
  });

  return workspace;
};

const emailInit = async () => {
  let workspaceIntegrations = await getWorkspaceIntegration();
  // Initialize email listeners and transporters for each client
  workspaceIntegrations.forEach((client) => {
    const mailListener = new MailListener({
      username: client.emailConfig.user,
      password: client.emailConfig.password,
      host: client.emailConfig.host,
      port: client.emailConfig.port,
      tls: client.emailConfig.tls,
      mailbox: client.emailConfig.mailbox,
    });

    const transporter = nodemailer.createTransport(client.transporterConfig);

    mailListener.on("server:connected", () => {
      console.log(`Connected to email server for ${client.name}`);
    });

    mailListener.on("server:disconnected", () => {
      console.log(`Disconnected from email server for ${client.name}`);
    });

    mailListener.on("mail", async (mail, seqno, attributes) => {
      console.log(`New email received for ${client.name}:`, mail.subject);

      // Example of received email
      // Hi, I'm interested in your services. Can you please send me more information?

      // Function to get chatgpt response
      // This tag falls into the "company-website" context

      // Call chatgpt function to get response from chatgpt

      // Facebook Messenger, Whatsapp business, Facebook comments on ads post, Discord, Telegram, twitch, slack

      // Context tags
      // company-website
      // Has to contain
      // www.respondbuddy.com

      // company-address
      // Has to contain
      // 123 Main St, New York, NY 10001

      // schedule-meeting
      // Has to contain
      // www.calendly.com/respondbuddy

      // company-phone-number
      // What is my company?
      // What is my company's address?
      // What is my company's phone number?
      // What is my company's website?

      // Respond to the received email
      const responseEmail = {
        from: client.emailConfig.user,
        to: mail.from.value[0].address,
        subject: `RE: ${mail.subject}`,
        text: "Thank you for your email. We will get back to you shortly.",
      };

      try {
        await transporter.sendMail(responseEmail);
        console.log(`Response email sent for ${client.name}`);
      } catch (error) {
        console.error(
          `Error sending response email for ${client.name}:`,
          error
        );
      }
    });

    mailListener.start();
  });
};
