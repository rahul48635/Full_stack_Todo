import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient()
export const handler =NextAuth({ 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "text", placeholder: "username" },
        password: { label: "password", type: "text", placeholder: "password" }
      },
      authorize: async (credentials) => {
        // Replace this with your actual user authentication logic
        let user = null;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials?.username,
              password: credentials?.password
            }
          });
        } catch (e) {
          throw e
        }finally{
          await prisma.$disconnect()
        }
        if (user) {
          // Convert id to string to match NextAuth User type
          return {
            ...user,
            id: user.id.toString(),
          };
        }
        return null;
      }
    }),
    GoogleProvider({
          clientId: process.env.GOOGLE_ID ?? "",
          clientSecret: process.env.GOOGLE_SECRET ?? "",
        })
  ],
  // pages: {
  //   signIn: '/signin'
  // }
})
export { handler as GET, handler as POST }