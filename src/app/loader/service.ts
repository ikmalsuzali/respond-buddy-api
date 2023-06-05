import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { convertS3UrlToTempFile } from "../s3/service";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import fs from "fs";
import XLSX from "xlsx";

export const convertExcelToCSV = async (s3Url: string) => {
  if (s3Url.includes(".xlsx") || s3Url.includes(".xls")) {
    const tempFile = await convertS3UrlToTempFile(s3Url);

    if (!fs.existsSync(tempFile)) {
      throw new Error("File does not exist");
    }

    const workbook = XLSX.readFile(tempFile);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const writeStream = fs.createWriteStream(tempFile);
    writeStream.write(csv, "utf8");
    writeStream.end();
    return tempFile;
  } else {
    throw new Error("File type not supported");
  }
};

export const csvLoader = async (
  s3Url: string | null,
  tempFile: string | null
) => {
  if (s3Url?.includes(".csv")) {
    let newTempFile = tempFile;
    if (tempFile) {
      newTempFile = await convertS3UrlToTempFile(s3Url!);
    }

    const loader = new CSVLoader(newTempFile!);
    const docs = await loader.load();
    return docs;
  } else {
    throw new Error("File type not supported");
  }
};

export const docLoader = async (
  s3Url: string | null,
  tempFile: string | null
) => {
  if (s3Url?.includes(".docx")) {
    let newTempFile = tempFile;
    if (tempFile) {
      newTempFile = await convertS3UrlToTempFile(s3Url!);
    }

    const loader = new DocxLoader(newTempFile!);
    const docs = await loader.load();
    return docs;
  } else {
    throw new Error("File type not supported");
  }
};

export const pdfLoader = async (
  s3Url: string | null,
  tempFile: string | null
) => {
  if (s3Url?.includes(".pdf")) {
    let newTempFile = tempFile;
    if (tempFile) {
      newTempFile = await convertS3UrlToTempFile(s3Url!);
    }

    const loader = new PDFLoader(newTempFile!);
    const docs = await loader.load();
    return docs;
  } else {
    throw new Error("File type not supported");
  }
};
