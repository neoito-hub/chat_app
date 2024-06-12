import { NextResponse } from "next/server";
import { getVectorStore, qdrantClient } from "../../../utils/chain.js";
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
 * /api/list_projects:
 *   post:
 *     summary: List projects
 *     description: List projects
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               context_status:
 *                type: integer
 *     responses:
 *       200:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  msg:
 *                   type: string
 *                   example: Project listed for the user
 *                  data:
 *                   type: object
 *                   properties:
 *                    id:
 *                     type: string
 *                    domains:
 *                     type: array
 *                     items:
 *                      type: sting
 *                    status:
 *                     type: int
 *                    name:
 *                     type: string
 *                    category:
 *                     type: string
 *                    created_at: 
 *                     type: string
 *                    updated_at:
 *                     type: string
 *                    collection_name:
 *                     type: string
 *                    user_id:
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

    let projectData: any;

    projectData = await utils.prisma.project.findUnique({
      where: {
        user_id: user.id,
        status: 1,
        id:body.id
      },
    });


    return NextResponse.json({
      msg: "Project listed for the user",
      data:projectData,
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
