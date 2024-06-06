import { PrismaClient } from '@prisma/client'

async function addTemplateLang (prisma: PrismaClient): Promise<void>{
    await prisma.template_languages.create({
      data: {
        id: 1,
        name: 'English(UK)',
        code: 'en_GB',
      },
    })
  
    console.log('Data seeded successfully')
  }
  
  export default addTemplateLang