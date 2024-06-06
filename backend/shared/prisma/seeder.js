import { PrismaClient } from '@prisma/client';
import addContact from "./seeder/contact_seed.js";
import addProject from "./seeder/project_seed.js";
import addTemplateCategory from "./seeder/temp_category_seed.js";
import addTemplateLang from "./seeder/temp_lang_seed.js";
import addVendor from "./seeder/vendor_seed.js";
const prisma = new PrismaClient();
async function main() {
  addContact(prisma);
  addProject(prisma);
  addTemplateCategory(prisma);
  addTemplateLang(prisma);
  addVendor(prisma);
}
main().then(async () => {
  await prisma.$disconnect();
}).catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
