import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { convertS3UrlToTempFile } from "../s3/service";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import fsPromise from "fs/promises";
import fs from "fs";
import XLSX from "xlsx";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";

export const loadFile = async ({
  s3Url,
  fileUrl,
  metadata,
}: {
  s3Url?: string;
  fileUrl?: string;
  metadata?: any;
}) => {
  const url = s3Url || fileUrl || "";
  const localMetadata = {
    ...metadata,
    source: url,
  };

  const tempFile = s3Url ? await convertS3UrlToTempFile(s3Url!) : fileUrl;

  if (!tempFile) throw new Error("File does not exist");

  if (!fs.existsSync(tempFile)) {
    throw new Error("File does not exist");
  }

  if (url.includes(".txt")) {
    return await textLoader(tempFile, localMetadata);
  } else if (url.includes(".csv")) {
    return await csvLoader(tempFile, localMetadata);
  } else if (url.includes(".pdf")) {
    return await pdfLoader(tempFile, localMetadata);
  } else if (url.includes(".docx")) {
    return await docLoader(tempFile, localMetadata);
  } else if (url.includes(".xlsx") || url.includes(".xls")) {
    return await excelLoader(tempFile, localMetadata);
  } else {
    throw new Error("File type not supported");
  }
};

export const textLoader = async (tempFile: string, metadata?: any) => {
  const outputText: string = await fsPromise.readFile(tempFile, "utf8");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 100,
  });
  const docs = await textSplitter.createDocuments([outputText]);

  docs.forEach((doc, index) => {
    console.log("🚀 ~ file: service.ts:64 ~ docs.forEach ~ doc:", doc.metadata);

    docs[index].metadata = {
      ...doc.metadata,
      ...metadata,
    };
  });

  return docs;
};

export const htmlLoader = async (tempFile: string, metadata?: any) => {
  // @ts-ignore
  const outputText: string = await fsPromise.readFile(tempFile, "utf8");

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 5000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([outputText]);

  docs.forEach((doc, index) => {
    docs[index].metadata = {
      ...doc.metadata,
      ...metadata,
    };
  });

  return docs;
};

export const excelLoader = async (tempFile: string, metadata?: any) => {
  const workbook = XLSX.readFile(tempFile);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  console.log("🚀 ~ file: service.ts:41 ~ excelLoader ~ csv:", csv);

  const writeStream = fs.createWriteStream(tempFile);
  writeStream.write(csv, "utf8");
  writeStream.end();
  const docs = await csvLoader(tempFile);

  docs.forEach((doc, index) => {
    // @ts-ignore
    console.log(
      "🚀 ~ file: service.ts:64 ~ docs.forEach ~ doc:",
      // @ts-ignore
      doc
    );

    // docs[index].metadata = {
    //   ...doc.metadata,
    //   ...metadata,
    // };
  });

  return docs;
};

export const csvLoader = async (tempFile: string | null, metadata?: any) => {
  const loader = new CSVLoader(tempFile!);
  const docs = await loader.load();

  docs.forEach((doc, index) => {
    // @ts-ignore

    docs[index].metadata = {
      ...doc.metadata,
      ...metadata,
    };
  });

  console.log(
    "🚀 ~ file: service.ts:64 ~ docs.forEach ~ doc:",
    // @ts-ignore
    docs
  );

  return docs;
};

export const pdfLoader = async (tempFile: string | null, metadata?: any) => {
  const loader = new PDFLoader(tempFile!);
  const docs = await loader.load();

  docs.forEach((doc, index) => {
    docs[index].metadata = {
      ...doc.metadata,
      ...metadata,
    };
  });

  return docs;
};

export const docLoader = async (tempFile: string | null, metadata?: any) => {
  const loader = new DocxLoader(tempFile!);
  const docs = await loader.load();

  docs.forEach((doc, index) => {
    docs[index].metadata = {
      ...doc.metadata,
      ...metadata,
    };
  });

  return docs;
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
