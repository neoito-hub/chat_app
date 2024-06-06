import prisma from './prisma/index.ts'
import utils from './utils/index.ts'
import validateBody from './validations/index.ts';
import 'dotenv/config'; 

export default {
  ...utils,
  prisma,
  validateBody
}
