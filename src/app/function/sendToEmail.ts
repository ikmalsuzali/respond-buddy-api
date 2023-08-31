import nodemailer from "nodemailer";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";

export const sendEmail = async ({
  message,
  metadata = {
    my_email: "",
  },
  fromEmail,
  username,
  password,
}: {
  message: string;
  metadata: any;
  fromEmail: string;
  username: string;
  password: string;
}) => {
  const messageEmails = extractEmails(message);
  let emails = messageEmails || [metadata.my_email];
  if (!emails) return { status: "error", message: "No email(s) found" };

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "your-smtp-server.com", // replace with your SMTP server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: username, // your email account
      pass: password, // your email password
    },
  });

  let gptResponse = await structuredMessage(message);

  // Set up email data
  const mailOptions = {
    from: "your-email@example.com", // sender address
    to: emails, // list of receivers
    subject: "", // subject line
    text: "", // plain text body
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const extractEmails = (text: string) => {
  // Email regex pattern
  const pattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;

  // Find matches in the text
  const matches = text.match(pattern);

  // If there are matches, return them, otherwise return an empty array
  return matches || [];
};

const emailZodSchema = () =>
  z.object({
    subject: z.string().describe("The subject of the email"),
    text: z.boolean().describe("The text of the email"),
  });

const zodPromptTemplate = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      "Generating email with subject: {subject} and text: {text}"
    ),
    HumanMessagePromptTemplate.fromTemplate("{inputText}"),
  ],
  inputVariables: ["inputText"],
});

const structuredMessage = async (message: string) => {
  const llm = new ChatOpenAI({});

  const chain = createStructuredOutputChainFromZod(emailZodSchema(), {
    prompt: zodPromptTemplate,
    llm,
    outputKey: "email",
  });

  const response = await chain.call({
    inputText: message,
  });

  return response;
};
