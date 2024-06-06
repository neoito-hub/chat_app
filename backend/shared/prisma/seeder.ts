import { PrismaClient } from '@prisma/client'
import addContact from './seeder/contact_seed.ts'
import addProject from './seeder/project_seed.ts'
import addTemplateCategory from './seeder/temp_category_seed.ts'
import addTemplateLang from './seeder/temp_lang_seed.ts'
import addVendor from './seeder/vendor_seed.ts'

const prisma = new PrismaClient()

async function main() {
  addContact(prisma)
  addProject(prisma)
  addTemplateCategory(prisma)
  addTemplateLang(prisma)
  addVendor(prisma)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })