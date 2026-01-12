'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, History, Settings } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              PromptForge
            </Link>

            <SignedIn>
              <div className="flex items-center gap-3 ml-3">
                <Link
                  href="/history"
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${pathname === '/history'
                    ? 'text-blue-400'
                    : 'text-slate-300 hover:text-white'
                    }`}
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </Link>
              </div>
            </SignedIn>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${pathname === link.href
                    ? 'text-blue-400'
                    : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 border-l border-slate-700 pl-4 h-8">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8"
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Settings"
                      labelIcon={<Settings className="h-4 w-4" />}
                      href="/settings"
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 text-slate-300 hover:text-white transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden pb-4 border-t border-slate-700 mt-2 pt-4">
            <div className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors px-2 py-2 rounded-lg ${pathname === link.href
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
