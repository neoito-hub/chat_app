import { NextResponse } from "next/server";
import { openai } from "../../../openai";

/**
 * @swagger
 * /api/fine_tune/{id}:
 *   get:
 *     summary: Retrieve fine-tuned data by Fine Tune ID
 *     description: Retrieve fine-tuned data by Fine Tune ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Fine Tune ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                   example: "Fine-tuned data retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: Fine-tuned data
 *                   example: {}
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                   example: "Fine Tune ID not passed"
 *                 error:
 *                   type: string
 *                   description: Error details
 *                   example: "Fine Tune ID not passed"
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const fineTuneId = params.slug;

  const fineTunedData = await openai.fineTuning.jobs.retrieve(fineTuneId);

  return NextResponse.json({
    msg: "Data returned ",
    data: fineTunedData,
  });
}
