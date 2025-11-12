import type { Metadata } from "next";
import SignInForm from "@/components/auth/sign-in";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function SignInPage() {
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <SignInForm />
    </section>
  );
}

