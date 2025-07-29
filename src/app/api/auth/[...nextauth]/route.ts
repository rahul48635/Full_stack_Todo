import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient()

export const authOptions={ 
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
          throw new Error(e instanceof Error ? e.message : String(e))
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
  callbacks: {
  async signIn(params: { 
    user: import("next-auth").User | import("next-auth/adapters").AdapterUser; 
    account: import("next-auth").Account | null; 
    profile?: import("next-auth").Profile; 
    email?: { verificationRequest?: boolean }; 
    credentials?: Record<string, unknown>;
  }) {
    const { user, account } = params;
    const prisma = new PrismaClient();

    try {
      // Only store Google users (you can check provider here)
      if (account && account.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? " " },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email ?? "",
              username: user.name ?? user.email ?? "",
              password: "", // Set a default or random value, since Google users don't have a password
              // other fields if needed
            },
          });
        }
      }

      return true; // allow sign-in
    } catch (error) {
      console.error('Sign-in error:', error);
      return false; // block sign-in
    } finally {
      await prisma.$disconnect();
    }
  },
}


  // pages: {
  //   signIn: '/signin'
  // }
}

export const handler =NextAuth(authOptions)
export { handler as GET, handler as POST }