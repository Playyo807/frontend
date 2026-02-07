import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { User } from "./prisma/generated/prisma/client";

export const { auth, handlers, signIn, signOut } = NextAuth({
  //@ts-expect-error
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!account) return true;

      const existingAccounts = await prisma.account.findMany({
        where: { userId: user.id },
      });

      if (existingAccounts.length > 0) {
        const existing = existingAccounts[0];

        if (existing.provider !== account.provider) {
          return false;
        }
      }

      return true;
    },
    async jwt({ token, trigger, session, account, profile }) {
      if (account && profile) {
        token.id = account.providerAccountId;
        token.accessToken = account?.access_token ?? "";
      }

      if (trigger === "update") {
        token.phone = session.phone;
        const account = await prisma.account.findFirst({
          where: { providerAccountId: token.id as string },
          include: {
            user: true,
          },
        });

        await prisma.user.update({
          where: { id: account?.userId },
          data: {
            phone: token.phone as string,
          },
        });
      }
      if (!token.role) {
        const account = await prisma.account.findFirst({
          where: { providerAccountId: token.id as string },
          include: {
            user: true,
          },
        });
        const user = await prisma.user.findFirstOrThrow({
          where: { id: account?.userId },
        });

        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (!token.phone) {
        const account = await prisma.account.findFirst({
          where: { providerAccountId: token.id as string },
          include: {
            user: true,
          },
        });

        const user = await prisma.user.findFirst({
          where: { id: account?.userId },
        });

        token.phone = user?.phone ?? "";
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
