import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password }: { username: string; password: string } = body;
  
  try{
    if(await prisma.user.findUnique({
      where: {
        email:username,
        password:password,
        username:username
      },
    })){
      return NextResponse.json({
        message:"user already exist"
      })
    }
    await prisma.user.create({
      data: {
        email:username,
        password:password,
        username:username
      },
    });
  }catch(e){
    NextResponse.json({message:`something went wrong ${e}`}
  )}finally{
    await prisma.$disconnect()
  }


  return NextResponse.json({
    message: "user has been created",
  });
}
