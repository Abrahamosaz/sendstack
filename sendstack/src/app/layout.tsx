import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "sendstack booking page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="root">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
