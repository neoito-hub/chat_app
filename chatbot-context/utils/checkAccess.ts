import prisma from "./prisma.mjs";

async function checkUserAccess(projectID: string, userID: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectID,
      user_id: userID,
    },
  });


  if (!project) {
    return { error: true, projects: null };
  }

  return { project: project, error: false };
}

export { checkUserAccess };
