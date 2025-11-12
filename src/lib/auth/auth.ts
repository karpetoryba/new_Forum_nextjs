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
});