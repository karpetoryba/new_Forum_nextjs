import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signInSchema } from "./zod"
import { ZodError } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
      }
      if (user?.role) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const userId =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" && token.sub) ||
          undefined

        if (userId) {
          session.user.id = userId
        }
        if (token.role) {
          session.user.role = token.role
        }
      }
      return session
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = signInSchema.parse({
            email: credentials?.email,
            password: credentials?.password,
          })

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          })

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role as "USER" | "MODERATOR" | "ADMIN",
          }
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.message)
          }

          throw new Error("Invalid credentials")
        }
      },
    }),
  ],
})