# Casino - Project Context

## Vision

Casino is a modern, visually stunning web-based gambling entertainment platform. Users create accounts with minimal friction (no email required), receive starting credits, and can enjoy various casino-style games in a sleek, premium interface.

## Target Audience

- Casual gamers looking for entertainment
- Users who enjoy the thrill of gambling mechanics without real money
- Design-conscious users who appreciate premium aesthetics

## Core User Journey

```
Registration → Captcha Verification → Receive 1000 Credits
    ↓
Spin Bonus Wheel (Daily) → Win Extra Credits
    ↓
Browse Games → Select Game → Place Bets → Play
    ↓
Win/Lose → Balance Updates → Continue Playing
```

## Key Features

### Foundation

- [ ] User registration with username + password
- [ ] Simple captcha verification
- [ ] Initial balance of 1000 credits
- [ ] Basic user dashboard
- [ ] Balance display with animations

### Bonus System

- [ ] Daily bonus wheel
- [ ] Wheel spin animation (Framer Motion)
- [ ] Reward distribution (50-500 credits)
- [ ] Spin cooldown tracking

### Games

- [ ] Slot Machine (3x3 reels)
- [ ] Roulette (European style)
- [ ] Blackjack (standard rules)
- [ ] Bet amount selection
- [ ] Win/loss animations

### Polish

- [ ] Sound effects
- [ ] Transaction history
- [ ] Game statistics
- [ ] Achievements (optional)
- [ ] Leaderboards (optional)

## Technical Decisions

### Why These Technologies?

| Choice              | Rationale                                                  |
| ------------------- | ---------------------------------------------------------- |
| **Next.js 16+**     | App Router, Server Components, API routes in one framework |
| **React 19**        | Latest features, better performance                        |
| **Tailwind v4**     | New engine, better CSS-first approach                      |
| **shadcn/ui**       | High-quality, customizable components                      |
| **Framer Motion**   | Best-in-class React animations                             |
| **SQLite + Prisma** | Simple, file-based DB perfect for this scope               |
| **No Email Auth**   | Reduces friction, simpler UX                               |

### Architecture Principles

1. **Server-Side Game Logic** - All randomization and payouts calculated on server
2. **Optimistic UI** - Immediate feedback, reconcile with server
3. **Component Isolation** - Each game is a self-contained module
4. **Animation-First** - Every interaction should feel satisfying

## Design Philosophy

### Visual Identity

- **Dark & Premium** - Ink black backgrounds, subtle gradients
- **Oceanic Palette** - Blues and teals for trust and calm
- **Gold Accents** - Cornsilk for currency and wins
- **Glassmorphism** - Frosted glass cards and modals

### Motion Design

- **Entrance**: Subtle fade + scale from 0.95
- **Hover**: Gentle lift with glow
- **Click**: Quick press feedback
- **Success**: Celebratory burst animations
- **Numbers**: Rolling/flipping when changing

## Constraints & Scope

### In Scope

- Single-player games only
- Virtual currency (no real money)
- Browser-based (responsive)
- Local SQLite database

### Out of Scope (For Now)

- Real money transactions
- Multiplayer games
- Native mobile apps
- Social features
- Email verification
- Password recovery

## Success Metrics

1. **Visual Appeal** - Users are impressed by the design
2. **Smooth Animations** - 60fps on all interactions
3. **Fast Load** - <2s initial load time
4. **Engagement** - Games are fun to play repeatedly

## File References

- [.gemini-rules](../.gemini-rules) - Development rules & color palette
- [plan.md](./plan.md) - Implementation roadmap
