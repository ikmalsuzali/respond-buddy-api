import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { convertS3UrlToTempFile } from "../s3/service";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import fsPromise from "fs/promises";
import fs from "fs";
import XLSX from "xlsx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";

export const textLoader = async (tempFile: string) => {
  const outputText: string = await fsPromise.readFile(tempFile, "utf8");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 10,
  });
  const docs = await textSplitter.createDocuments([outputText]);

  return docs;
};

export const htmlLoader = async (tempFile: string) => {
  // @ts-ignore
  const outputText: string = await fsPromise.readFile(tempFile, "utf8");

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([outputText]);

  return docs;
};

export const convertExcelToCSV = async (tempFile: string) => {
  const workbook = XLSX.readFile(tempFile);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const writeStream = fs.createWriteStream(tempFile);
  writeStream.write(csv, "utf8");
  writeStream.end();
  const docs = csvLoader(tempFile);
  return docs;
};

export const csvLoader = async (tempFile: string | null) => {
  const loader = new CSVLoader(tempFile!);
  const docs = await loader.load();
  return docs;
};

export const pdfLoader = async (tempFile: string | null) => {
  const loader = new PDFLoader(tempFile!);
  const docs = await loader.load();
  return docs;
};

export const docLoader = async (tempFile: string | null) => {
  const loader = new DocxLoader(tempFile!);
  const docs = await loader.load();
  return docs;
};

export const loadS3File = async (s3Url: string) => {
  const tempFile = await convertS3UrlToTempFile(s3Url!);

  if (!tempFile) throw new Error("File does not exist");

  if (!fs.existsSync(tempFile)) {
    throw new Error("File does not exist");
  }

  if (s3Url.includes(".txt")) {
    return textLoader(tempFile);
  } else if (s3Url.includes(".csv")) {
    return csvLoader(tempFile);
  } else if (s3Url.includes(".pdf")) {
    return pdfLoader(tempFile);
  } else if (s3Url.includes(".docx")) {
    return docLoader(tempFile);
  } else if (s3Url.includes(".xlsx") || s3Url.includes(".xls")) {
    return convertExcelToCSV(tempFile);
  } else {
    throw new Error("File type not supported");
  }
};

export const unstructuredLoader = async (tempFile: string) => {
  const loader = new UnstructuredLoader(tempFile, {
    apiUrl: "https://api.unstructured.io/general/v0/general",
  });

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });

  const splittedDocs = await splitter.splitDocuments(docs);
  return splittedDocs;
};
