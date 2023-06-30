// @ts-nocheck
import { FastifyInstance } from "fastify";
import {
  computeFileMD5,
  getTextByWebsiteURL,
  saveStore,
  readExcel,
  convertRawFileToDocs,
} from "../app/store/service";
import os from "os";
import { prisma } from "../prisma";
import { loadFile } from "../app/loader/service";
import { GoogleSheetService } from "../app/google/GoogleSheetService";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/store-type", async (request, reply) => {
    const { page, limit } = request.query || {};

    try {
      const data = await prisma.store_types.findMany({
        take: limit,
        skip: page,
      });

      if (!data) {
        throw new Error("Store types not found.");
      }

      reply.send({
        success: true,
        message: "Store types retrieved successfully.",
        data: data,
      });
    } catch (error) {
      reply.badRequest(error);
    }
  });

  fastify.get("/api/v1/store", async (request, reply) => {
    const { page, limit, store_type_ids } = request.query || {};
    try {
      const data = await prisma.stores.findMany({
        take: limit,
        skip: page,
        where: {
          store_type_id: {
            in: store_type_ids,
          },
        },
      });

      if (!data) {
        throw new Error("Stores not found.");
      }

      reply.send({
        success: true,
        message: "Stores retrieved successfully.",
        data: data,
      });
    } catch (error) {
      reply.badRequest(error);
    }
  });

  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, urls, type, tags, s3_url, metadata } = request.body || {};
    const tempFilePath = `${os.tmpdir()}/temp_file.txt`;
    let outputText = text;
    let docs = [];
    let s3Url;

    // Comment first before done working on store S3
    // eventManager.emit("store-s3");

    if (type === "raw" && text) {
      docs = await convertRawFileToDocs(text);
    } else if (type === "website_url" && urls) {
      for (const url of urls) {
        const text = await getTextByWebsiteURL(url);
        outputText += text;
      }

      docs = await convertRawFileToDocs(outputText);
    } else if (type === "upload" && s3_url) {
      docs = await loadFile({ s3Url: s3_url });
    } else if (type === "google_spreadsheet") {
      // TODO! This should store in a new table in supabase, but testing purpose pass in here first
      const spreadsheetId = metadata.spreadsheetId;
      const keyFile = "credentials.json";
      const scopes = "https://www.googleapis.com/auth/spreadsheets";
      const sheetName = metadata.sheetName;

      const googleSheetService = new GoogleSheetService({
        spreadsheetId,
        keyFile,
        scopes,
      });

      await googleSheetService.init();
      outputText = googleSheetService.getSpreadsheetUrl();

      const sheetData = await googleSheetService.getAllSheetData(sheetName);
      const { tempFilePath: excelTempFilePath, tempFile: excelTempFile } =
        await googleSheetService.convertSheetDataToExcel(sheetData);

      docs = await readExcel(excelTempFilePath);

      googleSheetService.removeTempFile();
    }

    let hash = null;
    let s3UrlData = null;
    if (s3_url) {
      hash = await computeFileMD5(s3_url);
      console.log("🚀 ~ file: store.ts:167 ~ fastify.post ~ hash:", hash);

      s3UrlData = await prisma.s3.findFirst({
        where: {
          s3_url,
        },
      });
    }

    const storeData = await saveStore({
      workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      outputText,
      type,
      docs,
      url: s3_url,
      hash,
      tags,
      metadata,
      s3Id: s3UrlData?.id,
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });
}
