"use client";

import { useAuth } from "@/hooks/useAuth";
import { BalanceDisplay } from "@/components/layout/BalanceDisplay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Coins, History, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cerulean-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-cornsilk-50">
            Welcome back, <span className="text-cerulean-400">{user?.username}</span>
          </h1>
          <p className="text-ink-black-400 mt-1">Ready to play?</p>
        </div>
        <Card className="p-4 bg-ink-black-900/50 border-ink-black-800 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-tropical-teal-500/10">
              <Coins className="w-6 h-6 text-tropical-teal-400" />
            </div>
            <div>
              <p className="text-sm text-ink-black-400">Current Balance</p>
              <BalanceDisplay balance={user?.balance || 0} size="lg" showLabel={false} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/slots" className="group">
          <Card className="p-6 bg-gradient-to-br from-ink-black-900 to-ink-black-950 border-ink-black-800 hover:border-cerulean-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cerulean-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-cerulean-500/10 group-hover:bg-cerulean-500/20 transition-colors">
                <Gamepad2 className="w-8 h-8 text-cerulean-400" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-cerulean-500/10 text-cerulean-400">Popular</span>
            </div>
            <h3 className="text-xl font-bold text-cornsilk-100 mb-2">Slots</h3>
            <p className="text-sm text-ink-black-400">Spin the reels and win big jackpots!</p>
          </Card>
        </Link>

        <Link href="/roulette" className="group">
          <Card className="p-6 bg-gradient-to-br from-ink-black-900 to-ink-black-950 border-ink-black-800 hover:border-tropical-teal-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-tropical-teal-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-tropical-teal-500/10 group-hover:bg-tropical-teal-500/20 transition-colors">
                <Trophy className="w-8 h-8 text-tropical-teal-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-cornsilk-100 mb-2">Roulette</h3>
            <p className="text-sm text-ink-black-400">Place your bets on your lucky numbers.</p>
          </Card>
        </Link>

        <Link href="/dashboard/transactions" className="group">
          <Card className="p-6 bg-gradient-to-br from-ink-black-900 to-ink-black-950 border-ink-black-800 hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <History className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-cornsilk-100 mb-2">History</h3>
            <p className="text-sm text-ink-black-400">View your recent transactions and game history.</p>
          </Card>
        </Link>

        <Link href="/wheel" className="group">
          <Card className="p-6 bg-gradient-to-br from-ink-black-900 to-ink-black-950 border-ink-black-800 hover:border-yellow-500/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                <span className="text-2xl">🎡</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-cornsilk-100 mb-2">Daily Bonus</h3>
            <p className="text-sm text-ink-black-400">Spin the wheel every day for free credits!</p>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="p-6 bg-ink-black-900/50 border-ink-black-800">
        <h3 className="text-lg font-bold text-cornsilk-100 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-ink-black-400">
          <p>No recent activity to show.</p>
          <Button variant="link" className="text-cerulean-400 mt-2">
            View all transactions
          </Button>
        </div>
      </Card>
    </div>
  );
}
