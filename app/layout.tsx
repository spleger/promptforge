import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptForge - Transform Ideas into Powerful AI Prompts",
  description: "Transform your casual descriptions into optimized, effective AI prompts using advanced prompt engineering techniques.",
  keywords: ["prompt engineering", "AI", "ChatGPT", "Claude", "prompt optimization"],
  authors: [{ name: "PromptForge" }],
  icons: {
    icon: '/icon.png',
  },
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
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#0f172a',
          colorInputBackground: '#1e293b',
          colorInputText: '#e2e8f0',
          colorText: '#e2e8f0',
          colorTextSecondary: '#94a3b8',
          colorDanger: '#ef4444',
          colorSuccess: '#22c55e',
          colorWarning: '#eab308',
          borderRadius: '0.5rem',
        },
        elements: {
          card: 'bg-slate-900 border border-slate-700',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-400',
          formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500',
          formFieldInput: 'bg-slate-800 border-slate-600 text-white',
          formFieldLabel: 'text-slate-300',
          footerActionLink: 'text-blue-400 hover:text-blue-300',
          identityPreview: 'bg-slate-800 border-slate-600',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-blue-400',
          userButtonPopoverCard: 'bg-slate-900 border border-slate-700',
          userButtonPopoverActionButton: 'text-slate-300 hover:bg-slate-800',
          userButtonPopoverActionButtonText: 'text-slate-300',
          userButtonPopoverFooter: 'hidden',
          profileSectionTitle: 'text-white',
          profileSectionTitleText: 'text-white',
          profileSectionContent: 'text-slate-300',
          profileSectionPrimaryButton: 'text-blue-400',
          accordionTriggerButton: 'text-white',
          accordionContent: 'text-slate-300',
          badge: 'bg-slate-700 text-slate-300',
          badgeText: 'text-slate-300',
          formFieldSuccessText: 'text-green-400',
          formFieldWarningText: 'text-yellow-400',
          formFieldErrorText: 'text-red-400',
          alertText: 'text-slate-300',
          dividerLine: 'bg-slate-700',
          dividerText: 'text-slate-500',
          otpCodeFieldInput: 'bg-slate-800 border-slate-600 text-white',
          phoneInputBox: 'bg-slate-800 border-slate-600 text-white',
          selectButton: 'bg-slate-800 border-slate-600 text-white',
          selectOptionsContainer: 'bg-slate-800 border-slate-600',
          selectOption: 'text-white hover:bg-slate-700',
          menuButton: 'text-slate-300 hover:bg-slate-800',
          menuItem: 'text-slate-300 hover:bg-slate-800',
          navbar: 'bg-slate-900 border-slate-700',
          navbarButton: 'text-slate-300 hover:bg-slate-800',
          pageScrollBox: 'bg-slate-900',
          page: 'text-slate-300',
          activeDevice: 'bg-slate-800 border-slate-600',
          activeDeviceListItem: 'text-slate-300',
          impersonationFab: 'bg-slate-800 text-white',
        },
      }}
    >
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
    </ClerkProvider>
  );
}
