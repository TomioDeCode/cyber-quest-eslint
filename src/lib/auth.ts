import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";
import { getServerSession } from "next-auth/next";
import prisma from "./prisma";
import { AdapterUser } from "next-auth/adapters";
import crypto from "crypto";

function CustomPrismaAdapter(): Adapter {
  return {
    async createUser(data: Omit<AdapterUser, "id">) {
      try {
        const randomPassword = crypto.randomBytes(32).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const user = await prisma.user.create({
          data: {
            email: data.email,
            emailVerified: data.emailVerified,
            name: data.name,
            role: "user",
            password: hashedPassword,
          },
        });

        return {
          ...user,
          id: user.id,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      } catch (error) {
        console.error("Create user error:", error);
        throw error;
      }
    },
    async getUser(id) {
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return {
          ...user,
          id: user.id,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      } catch (error) {
        console.error("Get user error:", error);
        return null;
      }
    },
    async getUserByEmail(email) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return {
          ...user,
          id: user.id,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      } catch (error) {
        console.error("Get user by email error:", error);
        return null;
      }
    },
    async createSession(data) {
      try {
        const session = await prisma.session.create({
          data: {
            ...data,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        return session;
      } catch (error) {
        console.error("Create session error:", error);
        throw error;
      }
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email dan password diperlukan");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("User tidak ditemukan");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            throw new Error("Password salah");
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "user";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await prisma.session.create({
        data: {
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          sessionToken: crypto.randomUUID(),
        },
      });
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
