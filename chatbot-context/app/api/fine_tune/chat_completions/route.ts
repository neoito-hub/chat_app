import { NextResponse } from "next/server";
import { openai } from "../../../openai";

/**
 * @swagger
 * /api/fine_tune/chat_completions:
 *   post:
 *     summary: Create chat completions
 *     description: Create chat completions using OpenAI GPT-3.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 description: The OpenAI GPT-3 model to use.
 *               content:
 *                 type: string
 *                 description: The content for the chat completion.
 *     responses:
 *       '200':
 *         description: Successful completion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: A success message.
 *                 data:
 *                   type: object
 *                   description: The completion data.
 */
export async function POST(request: Request) {
  const body = await request.json();

  const { model, content } = body;

  if (!model || !content) {
    return NextResponse.json({
      msg: "Validation failed! Model and content should not be null",
      error: "Validation failed! Model and content should not be null",
    });
  }

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: content }],
    model,
    max_tokens: 200,
  });

  return NextResponse.json({
    msg: "Data processed ",
    data: completion.choices[0],
  });
}
