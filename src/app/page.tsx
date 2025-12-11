"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const games = [
  {
    title: "Slots",
    description: "Spin the reels and hit the jackpot!",
    icon: "🎰",
    href: "/slots",
    color: "from-cornsilk-500 to-cornsilk-700",
  },
  {
    title: "Roulette",
    description: "Place your bets and watch the wheel spin.",
    icon: "🎡",
    href: "/roulette",
    color: "from-cerulean-500 to-cerulean-700",
  },
  {
    title: "Blackjack",
    description: "Beat the dealer and get 21!",
    icon: "🃏",
    href: "/blackjack",
    color: "from-tropical-teal-500 to-tropical-teal-700",
  },
  {
    title: "Bonus Wheel",
    description: "Free daily spin for bonus credits!",
    icon: "🎯",
    href: "/wheel",
    color: "from-ash-grey-500 to-ash-grey-700",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-black-950 via-ink-black-900 to-ink-black-950" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cerulean-500/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-cornsilk-500/10 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="animate-pulse w-2 h-2 rounded-full bg-tropical-teal-500" />
              <span className="text-sm text-ink-black-200">Start with 1,000 free credits</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-ink-black-50">Welcome to </span>
              <span className="text-gradient-gold">Casino</span>
            </h1>

            <p className="text-lg md:text-xl text-ink-black-300 mb-8 max-w-2xl mx-auto">
              Experience the thrill of premium casino games. Spin slots, beat the dealer, 
              and hit the jackpot — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-cornsilk-500 text-ink-black-950 hover:bg-cornsilk-400 font-bold text-lg px-8 py-6 rounded-xl glow-gold"
                >
                  Start Playing
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-cerulean-500 text-cerulean-400 hover:bg-cerulean-500/10 font-semibold text-lg px-8 py-6 rounded-xl"
                >
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 bg-ink-black-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-ink-black-50 mb-4">
              Choose Your Game
            </h2>
            <p className="text-ink-black-300 max-w-xl mx-auto">
              From classic slots to table games, we have something for everyone.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {games.map((game) => (
              <motion.div key={game.title} variants={itemVariants}>
                <Link href={game.href}>
                  <Card className="glass-card group cursor-pointer overflow-hidden hover:border-cerulean-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 text-3xl shadow-lg`}
                      >
                        {game.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-ink-black-50 mb-2 group-hover:text-cerulean-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-ink-black-400 text-sm">
                        {game.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon="💰"
              title="Free Credits"
              description="Start with 1,000 credits and spin the daily bonus wheel for more!"
            />
            <Feature
              icon="🔒"
              title="Secure & Fair"
              description="All games use server-side randomization for fair outcomes."
            />
            <Feature
              icon="⚡"
              title="Instant Play"
              description="No downloads required. Play directly in your browser."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-ink-black-50 mb-2">{title}</h3>
      <p className="text-ink-black-400">{description}</p>
    </motion.div>
  );
}
