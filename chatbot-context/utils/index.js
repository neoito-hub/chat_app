import { env } from "@appblocks/node-sdk";
import { createClient } from "redis";

import validateRequestMethod from "./validation/validateMethod.js";
import authenticateUser from "./validation/validateUser.js";
import httpStatusCodes from "./utils/httpStatusCodes.js";
import prisma from "./prisma.mjs";
import { sendMail } from "./utils/emailService.js";
import generateRandomString from "./utils/generateRandomString.js";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { writeFileSync, readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import  {marked}  from "marked";

/**
 * Function to format and send response
 * @param {*} res
 * @param {*} code
 * @param {*} data
 * @param {*} type
 */
const sendResponse = (res, code, data, type = "application/json") => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Content-Type": type,
  };
  console.log("END:", data, code);

  res.writeHead(code, headers);
  res.write(JSON.stringify(data));
  res.end();
};

/**
 * Function to extract the body from the request
 * @param {*} req
 * @returns
 */
const getBody = async (req) => {
  const bodyBuffer = [];
  for await (const chunk of req) {
    bodyBuffer.push(chunk);
  }
  const data = Buffer.concat(bodyBuffer).toString();
  return JSON.parse(data || "{}");
};

const checkHealth = (req, res) => {
  if (req.params.health === "health") {
    sendResponse(res, 200, { success: true, message: "Health check success" });
    console.log("returning true");
    return true;
  }
  console.log("returning false");
  return false;
};

const isEmpty = (value) => {
  if (value === null) {
    return true;
  }
  if (typeof value !== "number" && value === "") {
    return true;
  }
  if (typeof value === "undefined" || value === undefined) {
    return true;
  }
  if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  }
  return false;
};

const loadDirectory = async (uploadDirectory) => {
  convertMdFiles(uploadDirectory);

  const loader = new DirectoryLoader(uploadDirectory, {
    ".pdf": (path) => new PDFLoader(path),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path),
  });
  const docs = await loader.load();
  return docs;
};

const convertMdFiles = (directoryPath) => {
  const stack = [
    {
      source: directoryPath,
    },
  ];

  while (stack.length > 0) {
    const { source } = stack.pop();

    // if (!existsSync(destination)) {
    //   mkdirSync(destination, { recursive: true })
    // }

    const files = readdirSync(source);

    files.forEach((file) => {
      const sourcePath = path.join(source, file);
      // console.log("file path is", sourcePath);

      const fileType = path.extname(sourcePath);
      const fileStats = statSync(sourcePath);


      if (fileStats.isFile()) {
        if (fileType === ".md" || fileType === ".mdx") {
          const data = readFileSync(sourcePath, "utf8");

          // Convert Markdown to plain text using marked
          const plainText = marked(data);

          // Create the TXT file path with the same name as the MD file
          const txtFilePath = path.join(
            path.dirname(source),
            `${path.basename(file,fileType)}.txt`
          );

          // Write the plain text to the TXT file
          writeFileSync(txtFilePath, plainText, "utf8");
        }
      } else {
        stack.push({
          source: sourcePath,
        });
      }
    });
  }
};

env.init();

export default {
  sendResponse,
  getBody,
  httpStatusCodes,
  prisma,
  validateRequestMethod,
  validateUser: authenticateUser,
  checkHealth,
  isEmpty,
  sendMail,
  generateRandomString,
  loadDirectory,
};
