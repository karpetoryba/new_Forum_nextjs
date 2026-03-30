import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import AuthProvider from "./providers/AuthProvider";
import Navbar from "@/components/app/navigation/Navbar";
import Footer from "@/components/app/navigation/Footer";
import ThemeProvider from "./providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forum",
  description: "Partagez vos idees et participez a des conversations enrichissantes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ReactQueryProvider>
              <Toaster />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ReactQueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
