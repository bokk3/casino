# Phase 6: Roulette Implementation

## 6.1 Game Components

- [ ] Build `RouletteWheel` (CSS/SVG based with rotation) <!-- id: 6.1.1 -->
- [ ] Build `BettingTable` (Grid layout for numbers and outside bets) <!-- id: 6.1.2 -->
- [ ] Build `ChipSelector` (UI to pick bet amount) <!-- id: 6.1.3 -->

## 6.2 Game Logic (Server-Side)

- [ ] Define `ROULETTE_NUMBERS` (Color and value mapping) <!-- id: 6.2.1 -->
- [ ] Implement `calculatePayout` logic (Handle multiple bet types) <!-- id: 6.2.2 -->
- [ ] Create `/api/games/roulette/spin` endpoint <!-- id: 6.2.3 -->
  - [ ] Validate complex bet structure
  - [ ] Generate random number (0-36)
  - [ ] Calculate total win
  - [ ] Update balance and history

## 6.3 Betting Logic

- [ ] Manage `bets` state (Map of position -> amount) <!-- id: 6.3.1 -->
- [ ] Implement chip placement logic (Add/Remove chips) <!-- id: 6.3.2 -->
- [ ] Validate total bet against balance <!-- id: 6.3.3 -->

## 6.4 Integration

- [ ] Create `/dashboard/roulette` page <!-- id: 6.4.1 -->
- [ ] Add sound effects (Ball spin, land, chips) <!-- id: 6.4.2 -->
- [ ] Animations (Wheel spin timing, ball trajectory) <!-- id: 6.4.3 -->
