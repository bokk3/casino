export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // 2-10, 10 for face cards, 11 for Ace (handled specifically in calculation)
  isHidden?: boolean;
}

export const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
export const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = parseInt(rank);
      if (["J", "Q", "K"].includes(rank)) value = 10;
      if (rank === "A") value = 11;
      
      deck.push({ suit, rank, value });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.isHidden) continue; // Don't count hidden cards
    value += card.value;
    if (card.rank === "A") aces += 1;
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

// Initial state for dealing
export function dealInitialHand(): { deck: Card[]; playerHand: Card[]; dealerHand: Card[] } {
  let deck = shuffle(createDeck());
  
  const playerHand = [deck.pop()!, deck.pop()!];
  const dealerHand = [deck.pop()!, deck.pop()!];
  
  // Hide dealer's second card
  dealerHand[1].isHidden = true;

  return { deck, playerHand, dealerHand };
}

export type GameStatus = "playing" | "player_bust" | "dealer_bust" | "player_win" | "dealer_win" | "push" | "blackjack";

export interface Hand {
    cards: Card[];
    bet: number;
    status: GameStatus;
    result?: string; // e.g. "Win", "Lose", "Blackjack"
}

export interface GameState {
    deck: Card[];
    playerHands: Hand[];
    dealerHand: Card[];
    activeHandIndex: number; // Index of the hand currently being played
    status: "playing" | "finished"; // Overall game status
}
