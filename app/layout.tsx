import type { Metadata } from "next";
import { FinnestAuthProvider } from "@finnest-ai/ui-framework";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance Data Hub",
  description: "Powered by @finnest-ai/ui-framework",
  // Icons (favicon.ico, icon.png) are auto-detected from app/ directory
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <FinnestAuthProvider allowedDomains={["finnest.ai"]}>
          {children}
        </FinnestAuthProvider>
      </body>
    </html>
  );
}
