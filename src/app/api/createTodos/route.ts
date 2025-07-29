import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const prisma = new PrismaClient();

  const { title, description } = await req.json();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!title.trim() || !description.trim()) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  try {
    await prisma.todo.create({
      data: {
        title,
        description,
        author: {
          connect: { email: session.user.email },
        },
      },
    });

    return NextResponse.json({ message: 'Todo created' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
