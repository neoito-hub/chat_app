import { NextResponse } from "next/server";
import { getVectorStore, qdrantClient } from "../../../utils/chain";
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

    let user: any = await utils.validateUser(request);
    // let project:any = await checkUserAccess(collectionName, user.id);

    let projectData: any;
    let whereObject: any;

    whereObject = {
      user_id: user.id,
      status: 1,
    };

    if (body.search_string.length > 0) {
      whereObject = {
        ...whereObject,
        name: {
          contains: body.search_string,
          mode: "insensitive",
        },
      };
    }

    projectData = await utils.prisma.project.findMany({
     where: whereObject,
    });

    if (body?.context_status === 1) {
      let existingCollections = (await qdrantClient.getCollections())
        .collections;

      let existingCollectionsMap: any = {};

      await Promise.all(
        existingCollections.map(async (item: any) => {
          const result = await qdrantClient.getCollection(item.name);
          if (result?.vectors_count > 0) {
            existingCollectionsMap[`${item.name}`] = true;
          }
        })
      );

      let progressProjects = await projectData.filter((item: any) => {
        return !existingCollectionsMap[item.collection_name];
      });

      return NextResponse.json({
        msg: "Projects in progress listed for the user",
        data: { projects: progressProjects },
      });
    }

    if (body?.context_status === 2) {
      let existingCollections = (await qdrantClient.getCollections())
        .collections;

      let existingCollectionsMap: any = {};

      await Promise.all(
        existingCollections.map(async (item: any) => {
          const result = await qdrantClient.getCollection(item.name);
          if (result?.vectors_count > 0) {
            existingCollectionsMap[`${item.name}`] = true;
          }
        })
      );

      let completedProjects = await projectData.filter((item: any) => {
        return existingCollectionsMap[item.collection_name];
      });

      return NextResponse.json({
        msg: "Usable projects listed for the user",
        data: { projects: completedProjects },
      });
    }

    return NextResponse.json({
      msg: "All Projects listed for the user",
      data: { projects: projectData },
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
