import { NextResponse } from "next/server";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { getVectorStore } from "../../../utils/chain";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { checkUserAccess } from "@/utils/checkAccess";
import validateUser from "../../../utils/validation/validateUser.js";
import utils from "../../../utils/index.js";
import { addDocumentsToVectorStore, splitDocuments } from "@/utils/vectorStore";

/**
 * @swagger
 * /api/upload_youtube_url:
 *   post:
 *     summary: Upload youtube url
 *     description: Upload youtube url
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
 *     responses:
 *       200:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  msg:
 *                   type: string
 *                   example: Youtube context added to model
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

    const loader = YoutubeLoader.createFromUrl(body.url, {});

    const docs = await loader.load();

    const docOutput = await splitDocuments(docs);

    const vectorStore = getVectorStore(project.project.collection_name);
    await addDocumentsToVectorStore(docOutput, vectorStore);

    return NextResponse.json({
      msg: "Youtube url context added to model",
    });
  } catch (e: any) {
    console.log(e.message);
    if (e.errorCode && e.errorCode < 500) {
      return NextResponse.json({ error: e.message }, { status: e.errorCode });
    } else {
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }
  }
}
