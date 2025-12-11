# Phase 7: Blackjack Implementation

## 7.1 Card & Deck Logic (Shared)

- [ ] Design Card component (SVG or CSS based) <!-- id: 7.1.1 -->
- [ ] Implement `Deck` utility class (shuffle, draw) <!-- id: 7.1.2 -->
- [ ] Implement `Hand` value calculation logic (Ace handling) <!-- id: 7.1.3 -->

## 7.2 Server-Side Logic

- [ ] Create `BlackjackGame` class/helper for state management <!-- id: 7.2.1 -->
- [ ] Create `/api/games/blackjack/deal` endpoint (Start game) <!-- id: 7.2.2 -->
- [ ] Create `/api/games/blackjack/hit` endpoint <!-- id: 7.2.3 -->
- [ ] Create `/api/games/blackjack/stand` endpoint (Dealer turn) <!-- id: 7.2.4 -->
- [ ] Implement dealer AI (Hit soft 17 rule?) <!-- id: 7.2.5 -->
- [ ] Implement Double Down and Split logic (optional MVP) <!-- id: 7.2.6 -->

## 7.3 UI Components

- [ ] Build `BlackjackTable` layout <!-- id: 7.3.1 -->
- [ ] Display Dealer Hand (with hidden card) <!-- id: 7.3.2 -->
- [ ] Display Player Hand <!-- id: 7.3.3 -->
- [ ] Action Controls (Hit, Stand, Double, Split) <!-- id: 7.3.4 -->
- [ ] Game Status Messages (Bust, Blackjack, Win, Push) <!-- id: 7.3.5 -->

## 7.4 Integration

- [ ] Create `/dashboard/blackjack` page <!-- id: 7.4.1 -->
- [ ] Integrate with Balance system <!-- id: 7.4.2 -->
- [ ] Add sound effects (Card flip, chips) <!-- id: 7.4.3 -->
