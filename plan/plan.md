# Casino - Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for the Casino project. Each phase builds upon the previous, ensuring a stable foundation before adding complexity.

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Project

- [ ] Create Next.js 15+ project with TypeScript
- [ ] Configure Tailwind CSS v4
- [ ] Install and configure shadcn/ui
- [ ] Set up Framer Motion
- [ ] Configure ESLint & Prettier

### 1.2 Database Setup

- [ ] Install Prisma
- [ ] Create SQLite database
- [ ] Define User schema
- [ ] Define Transaction schema
- [ ] Define GameHistory schema
- [ ] Define BonusSpin schema
- [ ] Generate Prisma client
- [ ] Create seed script

### 1.3 Theme & Styling

- [ ] Configure color palette in Tailwind config
- [ ] Create CSS variables for all colors
- [ ] Set up global styles (dark theme)
- [ ] Configure typography (Inter font)
- [ ] Create base component variants

### 1.4 Layout Components

- [ ] Create root layout with providers
- [ ] Build Header component
- [ ] Build Footer component
- [ ] Build Sidebar/Navigation
- [ ] Create BalanceDisplay component
- [ ] Add page transition animations

---

## Phase 2: Authentication System

### 2.1 Auth Infrastructure

- [ ] Create auth utility functions
- [ ] Set up session management (cookies)
- [ ] Implement password hashing (bcrypt)
- [ ] Create auth middleware
- [ ] Set up protected routes

### 2.2 Registration

- [ ] Build RegisterForm component
- [ ] Create simple Captcha component
- [ ] Implement `/api/auth/register` endpoint
- [ ] Add client-side validation (Zod)
- [ ] Create success/error states
- [ ] Auto-assign 1000 credits on registration

### 2.3 Login

- [ ] Build LoginForm component
- [ ] Implement `/api/auth/login` endpoint
- [ ] Handle authentication errors
- [ ] Redirect to dashboard on success

### 2.4 Session Management

- [ ] Implement `/api/auth/me` endpoint
- [ ] Implement `/api/auth/logout` endpoint
- [ ] Create useAuth hook
- [ ] Handle session expiry gracefully

---

## Phase 3: User Dashboard

### 3.1 Dashboard Page

- [ ] Create dashboard layout
- [ ] Display user information
- [ ] Show current balance (animated)
- [ ] Quick links to games
- [ ] Recent activity summary

### 3.2 Balance System

- [ ] Create `/api/user/balance` endpoint
- [ ] Build useBalance hook with optimistic updates
- [ ] Animate balance changes (Framer Motion)
- [ ] Add currency formatting

### 3.3 Transaction History

- [ ] Create `/api/user/transactions` endpoint
- [ ] Build TransactionList component
- [ ] Add pagination
- [ ] Filter by transaction type

---

## Phase 4: Bonus Wheel

### 4.1 Wheel Component

- [ ] Design wheel segments (8-12 segments)
- [ ] Build BonusWheel component
- [ ] Implement spin animation (Framer Motion)
- [ ] Add pointer/indicator
- [ ] Create reward reveal animation

### 4.2 Wheel Logic

- [ ] Define reward tiers (50, 100, 150, 200, 250, 500)
- [ ] Implement server-side randomization
- [ ] Create `/api/wheel/spin` endpoint
- [ ] Create `/api/wheel/status` endpoint
- [ ] Enforce 24-hour cooldown

### 4.3 Integration

- [ ] Add wheel to dashboard
- [ ] Show countdown until next spin
- [ ] Celebrate wins with effects
- [ ] Update balance on reward

---

## Phase 5: Slot Machine

### 5.1 Slot Component

- [ ] Design reel symbols (7 types)
- [ ] Build SlotMachine component
- [ ] Create individual Reel component
- [ ] Implement spin animation
- [ ] Add win line highlights

### 5.2 Game Logic

- [ ] Define paytable (symbol combinations)
- [ ] Implement RNG on server
- [ ] Calculate payouts
- [ ] Create `/api/games/slots` endpoint

### 5.3 Betting System

- [ ] Build BetSelector component
- [ ] Validate bets against balance
- [ ] Deduct bet before spin
- [ ] Add winnings after result

### 5.4 Polish

- [ ] Add spin sound effects
- [ ] Win celebration animation
- [ ] Loss feedback
- [ ] Spin history display

---

## Phase 6: Roulette

### 6.1 Roulette Component

- [ ] Design roulette wheel (European 0-36)
- [ ] Build RouletteWheel component
- [ ] Create betting table layout
- [ ] Implement ball spin animation

### 6.2 Betting Types

- [ ] Single number bets (35:1)
- [ ] Red/Black bets (1:1)
- [ ] Odd/Even bets (1:1)
- [ ] High/Low bets (1:1)
- [ ] Dozen bets (2:1)
- [ ] Column bets (2:1)

### 6.3 Game Logic

- [ ] Server-side number generation
- [ ] Payout calculation
- [ ] Create `/api/games/roulette` endpoint
- [ ] Multi-bet handling

### 6.4 Animation

- [ ] Wheel spinning animation
- [ ] Ball bouncing effect
- [ ] Winning number highlight
- [ ] Chip placement animations

---

## Phase 7: Blackjack

### 7.1 Card Components

- [ ] Design card faces (52 cards)
- [ ] Build Card component
- [ ] Create deck utilities
- [ ] Card flip animation

### 7.2 Table Component

- [ ] Build BlackjackTable component
- [ ] Player hand display
- [ ] Dealer hand display
- [ ] Action buttons (Hit, Stand, Double, Split)

### 7.3 Game Logic

- [ ] Implement card shuffling
- [ ] Hand value calculation
- [ ] Dealer AI (hit on 16, stand on 17)
- [ ] Create `/api/games/blackjack` endpoint
- [ ] Handle game states (betting, playing, result)

### 7.4 Features

- [ ] Double down logic
- [ ] Split pairs logic
- [ ] Insurance (optional)
- [ ] Blackjack (21) bonus payout

---

## Phase 8: Polish & Optimization

### 8.1 Sound System

- [ ] Set up Howler.js
- [ ] Add UI interaction sounds
- [ ] Game-specific sound effects
- [ ] Win/lose audio feedback
- [ ] Volume controls

### 8.2 Animations

- [ ] Review all animations for smoothness
- [ ] Add loading skeletons
- [ ] Page transition effects
- [ ] Error state animations

### 8.3 Performance

- [ ] Lazy load game components
- [ ] Optimize images
- [ ] Implement proper caching
- [ ] Code splitting

### 8.4 Testing

- [ ] Unit tests for game logic
- [ ] Integration tests for API
- [ ] E2E tests for user flows
- [ ] Accessibility audit

---

## Milestones

| Milestone       | Phases | Target                         |
| --------------- | ------ | ------------------------------ |
| **MVP**         | 1-3    | Project setup, auth, dashboard |
| **First Game**  | 4-5    | Bonus wheel + Slots            |
| **Full Casino** | 6-7    | All games playable             |
| **Production**  | 8      | Polished & deployed            |

---

## Risk Mitigation

| Risk                        | Mitigation                                    |
| --------------------------- | --------------------------------------------- |
| Animation performance       | Use CSS transforms, GPU acceleration          |
| Complex game logic bugs     | Thorough unit testing, server-side validation |
| State management complexity | Keep game state isolated per component        |
| Mobile responsiveness       | Mobile-first development approach             |

---

## Notes

- Each phase should be fully completed before moving to the next
- All game outcomes must be determined server-side
- Animations should respect `prefers-reduced-motion`
- Regular commits at meaningful checkpoints
