import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptForge - Transform Ideas into Powerful AI Prompts",
  description: "Transform your casual descriptions into optimized, effective AI prompts using advanced prompt engineering techniques.",
  keywords: ["prompt engineering", "AI", "ChatGPT", "Claude", "prompt optimization"],
  authors: [{ name: "PromptForge" }],
  openGraph: {
    title: "PromptForge - Transform Ideas into Powerful AI Prompts",
    description: "Transform your casual descriptions into optimized, effective AI prompts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  );
}
