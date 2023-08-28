// @ts-nocheck
import { FastifyInstance } from "fastify";
import {
  computeFileMD5,
  getTextByWebsiteURL,
  saveStore,
  readExcel,
  convertRawFileToDocs,
  convertUrlToFilename,
  countFilteredStores,
} from "../app/store/service";
import { prisma } from "../prisma";
import { loadFile } from "../app/loader/service";
import { GoogleSheetService } from "../app/google/GoogleSheetService";
import { getDocsFromRedis } from "../app/redis/service";

export function storeRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/store-type", async (request, reply) => {
    const { page, limit } = request.query || {};

    try {
      const data = await prisma.store_types.findMany({
        take: limit,
        skip: page,
        where: {
          is_deleted: false,
        },
      });

      if (!data) {
        throw new Error("Store types not found.");
      }

      console.log(data);

      reply.send({
        success: true,
        message: "Store types retrieved successfully.",
        data: data,
      });
    } catch (error) {
      reply.badRequest(error);
    }
  });

  fastify.get("/api/v1/store/docs", async (request, reply) => {
    const { search } = request.query || {};
    const workspaceId = request?.token_metadata?.custom_metadata?.workspace_id;
    const keys = {};

    const stores = await prisma.store.findMany({
      where: {
        workspace: request?.token_metadata?.custom_metadata?.workspace_id,
      },
      include: {
        s3_s3Tostore: true,
        store_types: true,
      },
    });

    console.log("🚀 ~ file: store.ts:50 ~ fastify.get ~ stores:", stores);

    if (!search) {
      reply.send({
        success: true,
        message: "Docs retrieved successfully.",
        data: {
          stores: stores,
        },
      });
    }

    const getDocsFromRedisInParallel = stores.map((store) => {
      return getDocsFromRedis({
        workspaceId,
        storeId: store.id,
        message: search,
        similarityCount: 5,
      });
    });

    const results = await Promise.all(getDocsFromRedisInParallel);
    console.log("🚀 ~ file: store.ts:70 ~ fastify.get ~ results:", results);
    for (const result of results) {
      console.log("🚀 ~ file: store.ts:72 ~ fastify.get ~ result:", result);
      // if (
      //   result?.[0]?.[0]?.metadata?.workspace_id &&
      //   result?.[0]?.[0]?.metadata?.store_id
      // ) {
      //   keys[
      //     `${result?.[0]?.[0]?.metadata?.workspace_id}:${result?.[0]?.[0]?.metadata?.store_id}`
      //   ] = {
      //     docs: result,
      //     store_data: stores.find(
      //       (store) => store.id === result?.[0]?.[0]?.metadata?.store_id
      //     ),
      //   };
      // }
    }

    console.log("🚀 ~ file: store.ts:74 ~ fastify.get ~ keys:", keys);

    if (!search) {
      reply.send({
        success: true,
        message: "Docs retrieved successfully.",
        data: [],
      });
      return;
    }

    reply.send({
      success: true,
      message: "Docs retrieved successfully.",
      data: keys,
    });
  });

  fastify.get("/api/v1/store", async (request, reply) => {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 12;
    const search = request.query.search || "";

    const pageLimit = parseInt(limit);
    let where = {
      workspace: request?.token_metadata?.custom_metadata?.workspace_id,
    };

    let orderBy = {
      ["created_at"]: "desc",
    };

    if (search) {
      where.s3_s3Tostore = {
        original_name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    try {
      const stores = await prisma.store.findMany({
        skip: (page - 1) * limit,
        take: pageLimit,
        where,
        orderBy,
        include: {
          s3_s3Tostore: true,
          store_types: true,
          users: true,
        },
      });

      const totalStores = await prisma.store.count({
        where,
      });

      if (!stores) {
        reply.send({
          message: "No memories found",
          success: true,
          data: [],
          total: totalStores,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalStores / limit),
        });
      }

      reply.send({
        success: true,
        data: stores,
        message: "Memories retrieved successfully.",
        total: totalStores,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalStores / limit),
      });
    } catch (error) {
      reply.badRequest(error);
    }
  });

  fastify.post("/api/v1/store", async (request, reply) => {
    const { filename, text, url, type, store_type, tags, s3_url, metadata } =
      request.body || {};
    let outputText = text;
    let docs = [];
    let s3Url = s3_url;

    if (type === "raw") {
      if (!text) throw new Error("Text is required.");
      const rawData = await convertRawFileToDocs({
        text,
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        filename: filename || "Untitled text",
      });

      docs = rawData.docs;
      s3Url = rawData.s3Url;
    } else if (type === "website_url" && url) {
      const text = await getTextByWebsiteURL(url);
      outputText += text;

      const rawData = await convertRawFileToDocs({
        text: outputText,
        workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
        filename: convertUrlToFilename(url),
      });

      docs = rawData.docs;
      s3Url = rawData.s3Url;
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
    if (s3Url) {
      // Hash the file to check if it's already uploaded
      hash = await computeFileMD5(s3Url);
      s3UrlData = await prisma.s3.findFirst({
        where: {
          s3_url: s3Url,
        },
      });
    }

    const storeData = await saveStore({
      createdBy: request.token_metadata.custom_metadata?.user_id,
      workspaceId: request?.token_metadata?.custom_metadata?.workspace_id,
      outputText,
      type,
      docs,
      url: s3Url,
      hash,
      tags,
      metadata,
      s3Id: s3UrlData?.id,
      storeTypeId: store_type,
    });

    reply.send({
      success: true,
      message: "Store saved successfully.",
      data: storeData,
    });
  });

  fastify.delete("/api/v1/store/:id", async (request, reply) => {
    const { id } = request.params;
    const store = await prisma.store.findUnique({
      where: {
        id: id,
      },
    });

    if (!store) {
      reply.send({
        success: false,
        message: "Store not found.",
      });
      return;
    }

    await prisma.store.delete({
      where: {
        id: id,
      },
    });

    reply.send({
      success: true,
      message: "Store deleted successfully.",
    });
  });
}
