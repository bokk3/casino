"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/slots", label: "Slots", icon: "🎰" },
  { href: "/roulette", label: "Roulette", icon: "🎡" },
  { href: "/blackjack", label: "Blackjack", icon: "🃏" },
  { href: "/wheel", label: "Bonus Wheel", icon: "🎯" },
];

const accountItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/login", label: "Login", icon: "🔑" },
  { href: "/register", label: "Register", icon: "✨" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cerulean-500 text-ink-black-950 shadow-lg glow-primary flex items-center justify-center"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-ink-black-900 border-l border-ink-black-700 z-50 md:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ink-black-700">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cornsilk-400 to-cornsilk-600 flex items-center justify-center">
                  <span className="text-xl">🎰</span>
                </div>
                <span className="text-xl font-bold text-gradient-gold">Casino</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-lg bg-ink-black-800 flex items-center justify-center text-ink-black-300 hover:text-ink-black-100 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Balance */}
            <div className="p-4">
              <div className="glass-card p-4">
                <p className="text-ink-black-400 text-sm mb-1">Your Balance</p>
                <p className="currency text-2xl">$1,000</p>
              </div>
            </div>

            {/* Games Section */}
            <div className="p-4">
              <h3 className="text-ink-black-400 text-xs uppercase tracking-wider mb-3">
                Games
              </h3>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </div>

            {/* Account Section */}
            <div className="p-4 border-t border-ink-black-700">
              <h3 className="text-ink-black-400 text-xs uppercase tracking-wider mb-3">
                Account
              </h3>
              <nav className="space-y-2">
                {accountItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </nav>
            </div>

            {/* CTA */}
            <div className="p-4">
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-cornsilk-500 text-ink-black-950 hover:bg-cornsilk-400 font-bold">
                  Start Playing
                </Button>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-black-800/50 hover:bg-ink-black-700/50 text-ink-black-200 hover:text-ink-black-50 transition-all group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
