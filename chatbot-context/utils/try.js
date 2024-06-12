import prisma from './utils/prisma.js'

const replacer = (key, value) =>
  typeof value === 'bigint' ? value.toString() : value

async function main() {
  const totalCount = await prisma.leads.count()
  console.log(`Total count: ${totalCount}`)
  // console.table(totalCount)
  //   console.log('GC count:', JSON.stringify(gcList, null, ' '))
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
