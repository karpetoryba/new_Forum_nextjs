import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return <div>{children}</div>;
}
