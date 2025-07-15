import { Toaster } from "sonner";
import type { Metadata } from "next";
import Head from "next/head";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewAI",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mona-sans antialiased pattern">
        {children}

        <Toaster />
      </body>
    </html>
  );
}
