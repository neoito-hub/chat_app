import { NextRequest, NextResponse } from "next/server";
import { mkdirSync, rmSync, rmdirSync, statSync, writeFileSync } from "fs";

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { getVectorStore } from "../../../utils/chain";
import { File } from "buffer";
import { join } from "path";
import { checkUserAccess } from "@/utils/checkAccess";
import validateUser from "../../../utils/validation/validateUser.js";
import utils from "../../../utils/index.js";
import { addDocumentsToVectorStore, splitDocuments } from "@/utils/vectorStore";

// import { parseForm,  } from "../../../lib/parse-from";

/**
 * @swagger
 * /api/upload_csv:
 *  post:
 *   summary: Upload csv
 *   description: Upload csv
 *   parameters:
 *     - in: query
 *       name: projectName
 *       schema:
 *         type: string
 *       required: true  
 *   requestBody:
 *     content:
 *       multipart/form-data:
 *         schema:
 *           type: object
 *           required:
  *             - file1
 *           properties:
 *             file1:
 *               type: string
 *               format: binary
 *   responses:
 *     200:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: CSV context added to model
 *           description: Ok
 *     400:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Missing projectName parameter
 *           description: Bad request
 *     401:
 *       description: Unauthorized
 *     404:
 *       description: Resource not found
 *     409:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Conflict in CSV upload
 *           description: Conflict
 *     500:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: Internal Server Error
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectID = searchParams.get("project_id") as string;
    if (!projectID) {
     return Response.json(
       { success: false, message: "Param project id not found" },
       { status: 400 }
     );
   }



    let user: any = await utils.validateUser(request);
    let project: any = await checkUserAccess(projectID, user.id);

    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/uploads/csv/${Date.now()}`
    );

    try {
      await statSync(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdirSync(uploadDir, { recursive: true });
      } else {
        return NextResponse.json({
          data: null,
          error: "Internal Server Error",
        });
      }
    }

    const data = await request.formData();
    for await (const key of data.keys()) {
      const file = data.get(key) as unknown as File;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const path = `${uploadDir}/${file.name}`;
      await writeFileSync(path, buffer);
    }

    const loader = new DirectoryLoader(uploadDir, {
      ".csv": (path) => new CSVLoader(path),
    });
    const docs = await loader.load();

    const docOutput=await splitDocuments(docs)

    const vectorStore = getVectorStore(project.project.collection_name);
    await addDocumentsToVectorStore(docOutput,vectorStore)

    rmSync(uploadDir, { recursive: true, force: true });

    return NextResponse.json({
      msg: "Csv context added to model",
    });
  } catch (e: any) {
    console.log(e.message);
    if (e.errorCode && e.errorCode < 500) {
      return NextResponse.json({ error: e.message }, { status: e.errorCode });
    } else {
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }
  }
  //   });
}
