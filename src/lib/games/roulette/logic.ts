export type RouletteColor = "red" | "black" | "green";

export interface RouletteNumber {
  value: number;
  color: RouletteColor;
}

export const ROULETTE_NUMBERS: RouletteNumber[] = [
  { value: 0, color: "green" },
  { value: 32, color: "red" },
  { value: 15, color: "black" },
  { value: 19, color: "red" },
  { value: 4, color: "black" },
  { value: 21, color: "red" },
  { value: 2, color: "black" },
  { value: 25, color: "red" },
  { value: 17, color: "black" },
  { value: 34, color: "red" },
  { value: 6, color: "black" },
  { value: 27, color: "red" },
  { value: 13, color: "black" },
  { value: 36, color: "red" },
  { value: 11, color: "black" },
  { value: 30, color: "red" },
  { value: 8, color: "black" },
  { value: 23, color: "red" },
  { value: 10, color: "black" },
  { value: 5, color: "red" },
  { value: 24, color: "black" },
  { value: 16, color: "red" },
  { value: 33, color: "black" },
  { value: 1, color: "red" },
  { value: 20, color: "black" },
  { value: 14, color: "red" },
  { value: 31, color: "black" },
  { value: 9, color: "red" },
  { value: 22, color: "black" },
  { value: 18, color: "red" },
  { value: 29, color: "black" },
  { value: 7, color: "red" },
  { value: 28, color: "black" },
  { value: 12, color: "red" },
  { value: 35, color: "black" },
  { value: 3, color: "red" },
  { value: 26, color: "black" },
];

export const getNumberColor = (num: number): RouletteColor => {
    return ROULETTE_NUMBERS.find(n => n.value === num)?.color || "green";
};

// Bet Types: 
// "straight": 35:1 (e.g. key "17")
// "red", "black", "odd", "even", "high" (19-36), "low" (1-18): 1:1
// "dozen-1" (1-12), "dozen-2" (13-24), "dozen-3" (25-36): 2:1

export function calculateRoulettePayout(winningNumber: number, bets: Record<string, number>): number {
    let totalWin = 0;
    const winningColor = getNumberColor(winningNumber);

    for (const [betType, amount] of Object.entries(bets)) {
        if (amount <= 0) continue;

        // Straight Up
        const straighNum = parseInt(betType);
        if (!isNaN(straighNum)) {
            if (straighNum === winningNumber) {
                totalWin += amount * 36; // 35:1 + original bet
            }
            continue;
        }

        // Outside Bets (lose on 0 usually, except maybe generic rules, let's assume standard lose on 0 for outside)
        if (winningNumber === 0) continue;

        // Colors
        if (betType === "red" && winningColor === "red") totalWin += amount * 2;
        if (betType === "black" && winningColor === "black") totalWin += amount * 2;

        // Even/Odd
        if (betType === "even" && winningNumber % 2 === 0) totalWin += amount * 2;
        if (betType === "odd" && winningNumber % 2 !== 0) totalWin += amount * 2;

        // High/Low
        if (betType === "low" && winningNumber >= 1 && winningNumber <= 18) totalWin += amount * 2;
        if (betType === "high" && winningNumber >= 19 && winningNumber <= 36) totalWin += amount * 2;

        // Dozens
        if (betType === "dozen-1" && winningNumber >= 1 && winningNumber <= 12) totalWin += amount * 3;
        if (betType === "dozen-2" && winningNumber >= 13 && winningNumber <= 24) totalWin += amount * 3;
        if (betType === "dozen-3" && winningNumber >= 25 && winningNumber <= 36) totalWin += amount * 3;
    }

    return totalWin;
}
