import { NextResponse } from "next/server";
import { openai } from "../../openai";

/**
 * @swagger
 * /api/fine_tune:
 *   post:
 *     summary: Fine-tune a model using a training file
 *     description: Fine-tune a specified model using a training file identified by fileId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 description: The name of the model to fine-tune
 *                 example: gpt-3.5-turbo
 *               fileId:
 *                 type: string
 *                 description: The identifier of the training file.
 *                 example: your_file_id
 *     responses:
 *       '200':
 *         description: Fine-tuning job created successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: Fine-tuning job created successfully
 *               data:
 *                 // Fine-tuning job details
 *       '400':
 *         description: Bad Request. File id not passed.
 *         content:
 *           application/json:
 *             example:
 *               msg: File id not passed
 *               error: File id not passed
 */
export async function POST(request: Request) {
  const body = await request.json();

  const { model = "gpt-3.5-turbo", fileId } = body;

  if (!fileId) {
    return NextResponse.json({
      msg: "File id not passed",
      error: "File id not passed",
    });
  }

  const fineTune = await openai.fineTuning.jobs.create({
    training_file: fileId,
    model,
  });

  return NextResponse.json({
    msg: "Data processed ",
    data: fineTune,
  });
}
