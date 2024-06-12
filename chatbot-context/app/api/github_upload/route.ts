import { NextResponse } from "next/server";
import { getVectorStore } from "../../../utils/chain";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { execSync } from "child_process";
import { join } from "path";

import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { mkdirSync, rmSync, statSync } from "fs";
import { checkUserAccess } from "@/utils/checkAccess";
import validateUser from "../../../utils/validation/validateUser.js";
import utils from "../../../utils/index.js";
import {
  addDocumentsToVectorStore,
  splitDocuments,
} from "@/utils/vectorStore.ts";

/**
 * @swagger
 * /api/github_upload:
 *   post:
 *     summary: Upload github
 *     description: Upload github
 *     parameters:
 *      - in: query
 *        name: projectName
 *        schema:
 *         type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              url:
 *               type: string
 *              branch_name:
 *               type: string
 *     responses:
 *       200:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  msg:
 *                   type: string
 *                   example: Github repo context added to model
 *
 *         description: Ok
 *       400:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                type: string
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       409:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                type: string
 *         description: Conflict
 *       500:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                type: string
 *                example: failed
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;

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

    if (project.error) {
      return NextResponse.json({ error: "UnAuthorised" }, { status: 403 });
    }
    const branchName = body.branch_name;
    const uploadDirectory = join(
      process.env.ROOT_DIR || process.cwd(),
      `/uploads/github/${Date.now()}`
    );

    try {
      await statSync(uploadDirectory);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdirSync(uploadDirectory, { recursive: true });
      } else {
        return NextResponse.json({
          data: null,
          error: "Internal Server Error",
        });
      }
    }

    let docs: any;

    try {
      execSync(`git clone ${url} ${uploadDirectory}`);

      execSync(`git checkout ${branchName}`, { cwd: uploadDirectory });

      execSync(`git pull origin ${branchName}`, { cwd: uploadDirectory });

      docs = await utils.loadDirectory(uploadDirectory);
    } catch (e) {
      console.log("error is", e);
      rmSync(uploadDirectory, { recursive: true, force: true });
      return NextResponse.json({
        data: null,
        error: "Internal Server Error",
      });
    }

    const docOutput = await splitDocuments(docs);


    const vectorStore = getVectorStore(project.project.collection_name);
    await addDocumentsToVectorStore(docOutput, vectorStore);
    rmSync(uploadDirectory, { recursive: true, force: true });

    return NextResponse.json({
      msg: "Github repo context added to model",
    });
  } catch (e: any) {
    console.log("error is \n", e);

    if (e.errorCode && e.errorCode < 500) {
      return NextResponse.json({ error: e.message }, { status: e.errorCode });
    } else {
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }
  }
}
