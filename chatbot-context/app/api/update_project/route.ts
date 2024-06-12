import { NextResponse } from "next/server";
import { getVectorStore } from "../../../utils/chain";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { execSync } from "child_process";
import { join } from "path";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { mkdirSync, rmSync, rmdirSync, statSync, writeFileSync } from "fs";
import { checkUserAccess } from "@/utils/checkAccess";
import validateUser from "../../../utils/validation/validateUser.js";
import validateProjectInput from "./validation.js";
import utils from "../../../utils/index.js";

/**
 * @swagger
 * /api/update_project:
 *   post:
 *     summary: Update project
 *     description: Update project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *               type: string
 *              project_name:
 *               type: string
 *              category:
 *               type: string
 *              domains:
 *               type: array
 *               items:
 *                type: string
 *     responses:
 *       200:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  msg:
 *                   type: string
 *                   example: Project updated for the user
 *                  data:
 *                   type: object
 *                   properties:
 *                    id: 
 *                     type: string
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

    validateProjectInput(body);

    let user: any = await utils.validateUser(request);
    // let project:any = await checkUserAccess(collectionName, user.id);

    let project: any={}


    if (body?.project_name?.length ?? 0 > 0) {
      project.name = body.project_name;
    }

    if (body?.description?.length ?? 0 > 0) {
      project.description = body.description;
    }



    if (body?.category?.length ?? 0 > 0) {
      project.category = body.category;
    }


    if (body?.domains?.length ?? 0 > 0) {
      project.domains = body.domains;
    }   


    if (body?.status?.length ?? 0 > 0) {
      project.status = body.status;
    }

    let projectData: any;


    await utils.prisma.$transaction(async (tx: any) => {
      projectData = await tx.project.updateMany({
        data: project,
        where: {
          id: body.id,
          user_id: user.id,
        },
      });
    });


    return NextResponse.json({
      msg: "Project updated for the user",
      data: { id: projectData.id },
    });
    // })
  } catch (e: any) {
    console.log("error is \n", e);
    if (e.errorCode && e.errorCode < 500) {
      return NextResponse.json({ error: e.message }, { status: e.errorCode });
    } else {
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }
  }
}
