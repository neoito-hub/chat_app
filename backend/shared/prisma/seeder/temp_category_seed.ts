import { PrismaClient } from '@prisma/client'

async function addTemplateCategory(prisma: PrismaClient): Promise<void> {
  const bulkData = [
    {
      id: 1,
      name: 'MARKETING',
    },
    {
      id: 2,
      name: 'UTILITY',
    },
  ]

  await prisma.template_categories.createMany({
    data: bulkData,
  })

  console.log('Data seeded successfully')
}

export default addTemplateCategory
