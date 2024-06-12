import { NextResponse } from "next/server";
import { openai } from "../../../openai";
import { createReadStream, mkdirSync, statSync, writeFileSync } from "fs";
import { join, resolve } from "path";
/**
 * @swagger
 * /api/fine_tune/upload:
 *   post:
 *     summary: File upload for fine tuning
 *     description: JSONL file upload for fine tuning.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       '201':
 *         description: Created
 *       '200':
 *         description: Ok
 */
export async function POST(request: Request) {
  const formData = await request.formData();

  // Assuming 'file' is the name attribute in your HTML form for the file input.
  const fileData = formData.get("file") as File;

  if (!fileData) {
    return NextResponse.json({
      msg: "Error reading file",
      error: "Error reading file",
    });
  }

  const uploadDir = join(
    process.env.ROOT_DIR || process.cwd(),
    `/uploads/${Date.now()}`
  );

  try {
    statSync(uploadDir);
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      return NextResponse.json({
        data: null,
        error: "Internal Server Error",
      });
    }

    mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = `${uploadDir}/${fileData.name}`;
  const bytes = await fileData.arrayBuffer();
  const buffer = Buffer.from(bytes);

  writeFileSync(filePath, buffer);

  const fileUploadData = await openai.files.create({
    file: createReadStream(resolve(filePath)),
    purpose: "fine-tune",
  });

  return NextResponse.json({
    msg: "File uploaded successfully",
    data: fileUploadData,
  });
}
