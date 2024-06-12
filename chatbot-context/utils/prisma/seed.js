import { PrismaClient } from "@prisma/client";
import superAdmin from "./seeder/admin.seed.js";
// import { env } from "@appblocks/node-sdk";

// env.init();

const prisma = new PrismaClient();

async function main() {
  await superAdmin(prisma);
}

main()
  .catch((e) => {
    console.log("e", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
