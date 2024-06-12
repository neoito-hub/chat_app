import { NextResponse } from "next/server";
import { getVectorStore, qdrantClient } from "@/utils/chain";

import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { useSearchParams } from "react-router-dom";
import { checkUserAccess } from "@/utils/checkAccess";
import validateUser from "../../../utils/validation/validateUser.js";
import { hostname } from "os";
import { writeFileSync } from "fs";
import utils from "../../../utils/index.js";
import {
  addDocumentsToVectorStore,
  splitDocuments,
} from "@/utils/vectorStore.ts";
import { error } from "console";

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Website url scraping
 *     description: Website url scraping.
 *     parameters:
 *     - in: query
 *       name: projectName
 *       schema:
 *         type: string
 *       required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The website url
 *                 example: https://test-docs.com
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
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

    const url = body.url;

    //   await model.sequelize.transaction(async (t:any) => {
    //     const [existingUrl, created] = await model.scraping_logs.findOrCreate({
    //       where: { url: url },
    //       defaults: {
    //         url:url,
    //         status: 2,
    //       },
    //       transaction: t,
    //     });

    //     if(existingUrl){
    //         return NextResponse.json({
    //             msg: "url context added to model",
    //           });
    //     }

    let user: any = await utils.validateUser(request);
    let project: any = await checkUserAccess(projectID, user.id);

    if (project.error) {
      return NextResponse.json({ error: "UnAuthorised" }, { status: 403 });
    }

    const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

    const loader = new RecursiveUrlLoader(url, {
      extractor: compiledConvert,
      maxDepth: 100,
      preventOutside: false,
    });

    const docs = await loader.load();

    const docOutput = await splitDocuments(docs);

    const vectorStore = getVectorStore(project.project.collection_name);

    await addDocumentsToVectorStore(docOutput, vectorStore);

    return NextResponse.json({
      msg: "url context added to model",
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
