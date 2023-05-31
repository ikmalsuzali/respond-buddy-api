const MailListener = require("mail-listener4");

// export const findEmailsIntegrationByWorkspace = async (fastify, attrs) => {
//   const { workspaceId } = attrs;
//   const { emailsIntegration, error } =
//     await fastify.prisma.workspace_integrations.findMany({
//       where: {
//         workspace: ,
//       },
//     });

//   if (error) {
//     throw error;
//   }

//   return { emailsIntegration };
// };

export const validateEmailConnection = ({
  host,
  port,
  user,
  password,
  tls,
}: {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
}) => {
  return new Promise((resolve, reject) => {
    const mailListener = new MailListener({
      username: user,
      password: password,
      host: host,
      port: port,
      tls: tls,
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX",
      markSeen: false,
    });

    console.log(host, port, user, password, tls);
    mailListener.on("server:connected", () => {
      console.log("Email connection is valid");
      mailListener.stop();
      resolve(true);
    });

    mailListener.on("error", (err: Error) => {
      console.error("Email connection error:", err);
      reject(false);
    });

    mailListener.start();
  });
};
