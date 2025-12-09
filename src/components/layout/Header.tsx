"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-ink-black-700/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cornsilk-400 to-cornsilk-600 flex items-center justify-center shadow-lg glow-gold"
          >
            <span className="text-xl font-bold text-ink-black-950">🎰</span>
          </motion.div>
          <span className="text-xl font-bold text-gradient-gold">Casino</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/slots">Slots</NavLink>
          <NavLink href="/roulette">Roulette</NavLink>
          <NavLink href="/blackjack">Blackjack</NavLink>
          <NavLink href="/wheel">Bonus Wheel</NavLink>
        </nav>

        {/* Balance & User */}
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-sm text-ink-black-300">Balance:</span>
            <span className="currency text-lg">$1,000</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-cerulean-500 text-ink-black-950 font-semibold hover:bg-cerulean-400 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink-black-200 hover:text-cerulean-400 transition-colors font-medium"
    >
      {children}
    </Link>
  );
}
