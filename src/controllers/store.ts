// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getTextByWebsiteURL, saveStore } from "../app/store/service";
import { eventManager } from "../main";
import { storeS3File } from "../app/s3/service";
import fs from "fs";
import os from "os";
import { prisma } from "../prisma";
import { htmlLoader, loadFile, textLoader, excelLoader } from "../app/loader/service";
import { GoogleSheetService } from "../app/google/GoogleSheetService";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/store", async (request, reply) => {
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

  fastify.post("/api/v1/store", async (request, reply) => {
    const { text, urls, type, tags, s3_url, metadata } = request.body || {};
    const tempFilePath = `${os.tmpdir()}/temp_file.txt`;
    let outputText = text;
    let docs = [];
    let s3Url;

    // Comment first before done working on store S3
    // eventManager.emit("store-s3");

    const convertRawFileToDocs = async (text) => {
      await fs.writeFile(tempFilePath, text, async (err) => {
        if (err) throw new Error(err);

        // Read the local file content
        await fs.readFile(tempFilePath, async (err, data) => {
          if (err) throw new Error(err);

          // Store text file
            const storeResponse = await storeS3File({
              // Hard code filename & toBuffer function below as these information need in store S3 file function
              file: {
                filename: tempFilePath,
                toBuffer: () => data,
              },
              workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
            });
            s3Url = storeResponse?.url;
        });
      });

      return textLoader(tempFilePath);
    };

    const readExcel = async(excelTempFilePath) => {
      await fs.readFile(excelTempFilePath, async (err, data) => {
        if (err) throw new Error(err);

        const storeResponse = await storeS3File({
          file: {
            filename: excelTempFilePath,
            toBuffer: () => data,
          },
          workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        });
        s3Url = storeResponse?.url;
      });

      return excelLoader(excelTempFilePath)
    }

    if (type === "raw" && text) {
      docs = await convertRawFileToDocs(text);
    } else if (type === "website_url" && urls) {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        const text = await getTextByWebsiteURL(url);

        outputText += text;
      }

      docs = await convertRawFileToDocs(outputText);
    } else if (s3_url) {
      console.log("🚀 ~ file: store.ts:48 ~ fastify.post ~ s3_url:", s3);

      docs = await loadFile({s3Url: s3_url});
    } else if (type === 'google_spreadsheet') {
      // TODO! This should store in a new table in supabase, but testing purpose pass in here first
      const spreadsheetId = metadata.spreadsheetId;
      const keyFile = 'credentials.json';
      const scopes = 'https://www.googleapis.com/auth/spreadsheets';
      const sheetName = metadata.sheetName;

      const googleSheetService = new GoogleSheetService({
        spreadsheetId,
        keyFile,
        scopes
      })
      
      await googleSheetService.init()
      outputText = googleSheetService.getSpreadsheetUrl()

      const sheetData = await googleSheetService.getAllSheetData(sheetName)
      const {tempFilePath: excelTempFilePath, tempFile: excelTempFile} = await googleSheetService.convertSheetDataToExcel(sheetData)

      docs = await readExcel(excelTempFilePath)

      googleSheetService.removeTempFile()
    }

    console.log(s3Url)
    const storeData = await saveStore({
      outputText,
      workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      type,
      docs,
      url: s3Url,
      tags,
      metadata
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });
}
