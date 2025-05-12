// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";


// import { dark } from '@clerk/themes'; // You can set a default baseTheme for all Clerk components here

import Header from "@/components/header"; // Import your new Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpeciesSight",
  description: "AI-Powered Species Identification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} flex flex-col min-h-screen`}> {/* Added flex classes */}
          <Header /> {/* Add the Header here */}
          <main className="flex-grow"> {/* Make content grow to push footer down */}
            {children}
          </main>
          {/* You might want a Footer component here too */}
          {/* <Footer /> */}
          <Toaster />
        </body>
      </html>
  );
}