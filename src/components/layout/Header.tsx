"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BalanceChip } from "./BalanceDisplay";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";

export function Header() {
  const { user, isLoading, logout } = useAuth();

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
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-ink-black-400" />
          ) : user ? (
            <>
              <BalanceChip balance={user.balance} />
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium text-ink-black-200">
                  {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  className="text-ink-black-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-ink-black-200 hover:text-cerulean-400">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-cerulean-500 text-ink-black-950 hover:bg-cerulean-400 font-semibold">
                  Register
                </Button>
              </Link>
            </div>
          )}
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
