# Phase 5: Slot Machine Implementation

## 5.1 Slot Component

- [ ] Design reel symbols (7 types: Cherry, Lemon, Orange, Plum, Bell, Bar, 7) <!-- id: 5.1.1 -->
- [ ] Build `Reel` component with spinning animation <!-- id: 5.1.2 -->
- [ ] Build `SlotMachine` container component <!-- id: 5.1.3 -->
- [ ] Implement start/stop spin animation sequences <!-- id: 5.1.4 -->
- [ ] Add win line visualization (canvas or SVG overlays) <!-- id: 5.1.5 -->

## 5.2 Game Logic (Server-Side)

- [ ] Define `PAYTABLE` constant with symbol combinations and multipliers <!-- id: 5.2.1 -->
- [ ] Create server-side RNG logic for reel outcomes <!-- id: 5.2.2 -->
- [ ] Implement `calculatePayout` helper function <!-- id: 5.2.3 -->
- [ ] Create `/api/games/slots/spin` endpoint <!-- id: 5.2.4 -->
  - [ ] Validate bet amount
  - [ ] Deduct balance
  - [ ] Generate result
  - [ ] Calculate win
  - [ ] Update balance and history
  - [ ] Return result to client

## 5.3 Betting System

- [ ] Build `BetSelector` component (controls for bet size) <!-- id: 5.3.1 -->
- [ ] Integrate `useBalance` for real-time validation <!-- id: 5.3.2 -->
- [ ] Display potential payouts based on current bet <!-- id: 5.3.3 -->

## 5.4 Integration & Polish

- [ ] Add Slot Machine page to dashboard routing <!-- id: 5.4.1 -->
- [ ] Implement sound effects (spin, stop, win) <!-- id: 5.4.2 -->
- [ ] Add "Big Win" celebration animation <!-- id: 5.4.3 -->
- [ ] Display recent spin history <!-- id: 5.4.4 -->
