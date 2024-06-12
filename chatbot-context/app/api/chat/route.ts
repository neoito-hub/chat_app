import { NextResponse } from "next/server";
import { initChain } from "@/utils/chain";
import { Message } from "@/types/message";
import utils from "../../../utils/index.js";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question: string = body.query;
    const history: string = body.history ?? "";

    const { searchParams } = new URL(request.url);
    const projectID = searchParams.get("project_id") as string;
    if (!projectID) {
      return Response.json(
        { success: false, message: "Param project_id not found" },
        { status: 400 }
      );
    }

    let projectData = await utils.prisma.project.findUnique({
      where: {
        status: 1,
        id:projectID
      },
    });

    const chain = await initChain(projectData.collection_name);

    const res = await chain.invoke({
      question: question,
      chatHistory: history,
    });

    return NextResponse.json({
      role: "assistant",
      content: res,
      // links: links,
    });
  } catch (e: any) {
    console.log("error is \n", e);
    if (e.errorCode && e.errorCode < 500) {
      return NextResponse.json({ error: e.message }, { status: e.errorCode });
    } else {
      return NextResponse.json({ error: "failed" }, { status: 500 });
    }
  }
}
