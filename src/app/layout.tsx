import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Agent Ops · Claude Agent SDK Hosting Console",
  description:
    "Control plane for hosting the Claude Agent SDK: subprocess fleet, dual-write session storage, capacity planning, multi-tenant isolation, observability and security runbooks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
