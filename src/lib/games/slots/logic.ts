export type SlotSymbol = {
  id: string;
  name: string;
  icon: string; // Emoji for now, can be replaced with image path
  value: number; // Base value for checking wins
  weight: number; // For RNG (higher = more frequent)
};

export const SYMBOLS: SlotSymbol[] = [
  { id: "cherry", name: "Cherry", icon: "🍒", value: 2, weight: 40 },
  { id: "lemon", name: "Lemon", icon: "🍋", value: 3, weight: 30 },
  { id: "orange", name: "Orange", icon: "🍊", value: 4, weight: 25 },
  { id: "plum", name: "Plum", icon: "🫐", value: 5, weight: 20 },
  { id: "bell", name: "Bell", icon: "🔔", value: 10, weight: 10 },
  { id: "bar", name: "BAR", icon: "🎰", value: 20, weight: 5 },
  { id: "seven", name: "777", icon: "💎", value: 50, weight: 2 },
];

export const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

// Basic Paytable: Multipliers for 3 of a kind
export const PAYTABLE: Record<string, number> = {
  cherry: 5,
  lemon: 8,
  orange: 10,
  plum: 15,
  bell: 25,
  bar: 50,
  seven: 100,
};

// Two cherries (any position) = 2x
// One cherry (any position) = 0.5x (money back) - Optional

export function getRandomSymbol(): SlotSymbol {
  let random = Math.random() * TOTAL_WEIGHT;
  for (const symbol of SYMBOLS) {
    if (random < symbol.weight) {
      return symbol;
    }
    random -= symbol.weight;
  }
  return SYMBOLS[0];
}

export function calculateWin(reels: SlotSymbol[], bet: number): number {
  const counts: Record<string, number> = {};
  reels.forEach((s) => {
    counts[s.id] = (counts[s.id] || 0) + 1;
  });

  // Check for 3 of a kind
  for (const id in counts) {
    if (counts[id] === 3) {
      return bet * (PAYTABLE[id] || 0);
    }
  }

  // Check for 2 Cherries
  if (counts["cherry"] === 2) {
    return bet * 2;
  }
  
  // Check for 1 Cherry
  if (counts["cherry"] === 1) {
    return Math.floor(bet * 0.5); // Return half bet
  }

  return 0;
}
