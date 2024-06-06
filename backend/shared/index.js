import prisma from "./prisma/index.js";
import utils from "./utils/index.js";
import validateBody from "./validations/index.js";
import 'dotenv/config';
export default {
  ...utils,
  prisma,
  validateBody
};
