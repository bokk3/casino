"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-ink-black-950 border-t border-ink-black-800"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cornsilk-400 to-cornsilk-600 flex items-center justify-center">
                <span className="text-xl">🎰</span>
              </div>
              <span className="text-xl font-bold text-gradient-gold">Casino</span>
            </Link>
            <p className="text-ink-black-400 text-sm">
              Experience the thrill of premium casino games with virtual credits.
            </p>
          </div>

          {/* Games */}
          <div>
            <h4 className="text-ink-black-100 font-semibold mb-4">Games</h4>
            <ul className="space-y-2">
              <FooterLink href="/slots">Slots</FooterLink>
              <FooterLink href="/roulette">Roulette</FooterLink>
              <FooterLink href="/blackjack">Blackjack</FooterLink>
              <FooterLink href="/wheel">Bonus Wheel</FooterLink>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-ink-black-100 font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <FooterLink href="/login">Login</FooterLink>
              <FooterLink href="/register">Register</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-ink-black-100 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/responsible-gaming">Responsible Gaming</FooterLink>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-ink-black-800 pt-8 mb-8">
          <div className="glass-card p-4 text-center">
            <p className="text-ink-black-400 text-sm">
              ⚠️ This is an entertainment platform using virtual credits only. 
              No real money is involved. Must be 18+ to play.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-ink-black-500 text-sm">
          <p>© {currentYear} Casino. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tropical-teal-500 animate-pulse" />
              All games are provably fair
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-ink-black-400 hover:text-cerulean-400 transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  );
}
