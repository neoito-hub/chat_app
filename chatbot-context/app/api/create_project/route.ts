import { NextResponse } from "next/server";
import validateUser from "../../../utils/validation/validateUser.js";
import validateProjectInput from "./validation.js";
import utils from "../../../utils/index.js";
import { nanoid } from "nanoid";

/**
 * @swagger
 * /api/create_project:
 *   post:
 *     summary: Create new project
 *     description: Create new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                   example: Project created successfully
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

    let project: any = {
      name: body.project_name,
      category: body.category,
      domains: body.domains,
      description:body.description,
      user_id: user.id,
      status: 1,
      collection_name: nanoid() + "-" + body.project_name,
    };

    let projectData: any;

    await utils.prisma.$transaction(async (tx: any) => {
      projectData = await tx.project.create({
        data: project,
      });
    });

    // await qdrantClient.createCollection(body.project_name, {});


    return NextResponse.json({
      msg: "Project created for the user",
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
