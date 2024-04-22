import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import Chakra from "@/components/Chakra/Chakra";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liquidate Inventories",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container">
          <SessionAuthProvider>
            <Chakra>{children}</Chakra>
          </SessionAuthProvider>
        </main>
      </body>
    </html>
  );
}
