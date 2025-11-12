import type { Metadata } from "next";
import SignUpForm from "@/components/auth/sign-up";

export const metadata: Metadata = {
  title: "Inscription",
};

export default function SignUpPage() {
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <SignUpForm />
    </section>
  );
}

