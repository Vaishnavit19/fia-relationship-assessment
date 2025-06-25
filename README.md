# FIA Relationship Assessment

A sophisticated relationship assessment tool that uses travel scenarios to analyze personality patterns and relationship dynamics. Discover your unique archetype among 8 types while learning about relationship safety through our educational vulnerability assessment.

## ✨ What Makes This Special

- **20+ Branching Travel Scenarios** with London vs Paris pathways that adapt to your choices
- **8 Relationship Archetypes** with mathematical precision matching (Achiever, Intellectual, Leader, Explorer, Peacemaker, Dreamer, Rebel, Caregiver)
- **Vulnerability Education** featuring 17 manipulative persona types for relationship safety awareness
- **5 Minutes** adaptive completion time with intelligent question flow
- **Professional Results Interface** with three specialized tabs: Archetypes | Vulnerabilities | Attraction Patterns

## 🛠️ Tech Stack

**Core:** Next.js 15 • TypeScript • SCSS • Zustand • Framer Motion  
**Tools:** Storybook • Jest • ESLint • Prettier • pnpm

## 🚀 Quick Start

```bash
# Install and run
git clone <repository-url>
cd fia-relationship-assessment
pnpm install
pnpm dev
# Open http://localhost:3000
```

**Development Commands:**

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm storybook    # Component development
pnpm test         # Run tests
pnpm lint         # Code linting
```

## 📁 Key Project Structure

```
src/
├── app/                    # Next.js pages (homepage, assessment, results)
├── components/             # React components (ui, assessment, results)
├── lib/                    # Core logic and algorithms
│   ├── archetypeCalculator.ts    # Mathematical matching
│   ├── personaSelector.ts        # Vulnerability assessment
│   └── store.ts                  # State management
├── data/                   # Assessment data files
│   ├── extended-travel-scenarios.json
│   ├── extended-archetypes.json
│   └── enhanced-persona-cards.json
└── styles/                 # SCSS design system
```

## 🧠 How It Works

**Assessment Flow:** Travel scenarios → Dynamic branching → Mathematical analysis → Comprehensive results

**Scoring:** Each choice gets evaluated across emotional intelligence, logical planning, and exploratory spirit using sophisticated algorithms that calculate proximity to 8 distinct personality archetypes.

**Education:** Results include vulnerability awareness content tailored to your personality type, helping you recognize potential relationship risks and manipulation patterns.

## 🎭 The 8 Relationship Archetypes

**Primary Types:** Achiever 🏆 • Intellectual 🧠 • Leader 👑 • Explorer 🌍  
**Supporting Types:** Peacemaker ☮️ • Dreamer ✨ • Rebel ⚡ • Caregiver 💝

Each archetype represents a distinct approach to relationships, from goal-oriented achievement to nurturing care. The assessment uses mathematical algorithms to determine your unique blend across these personality types.

## 🔧 Development

**Component Development:** Uses Storybook for isolated component development  
**State Management:** Zustand with assessment progress persistence  
**Testing:** Comprehensive Jest test suite with system validation  
**Type Safety:** Full TypeScript coverage with strict mode enabled

```bash
pnpm storybook    # Component development
pnpm test         # Run validation tests
pnpm type-check   # TypeScript validation
```

## 🚀 Deployment

```bash
pnpm build    # Production build
pnpm start    # Production server
```

**Environment Variables** (optional):

```env
NEXT_PUBLIC_GA_ID=your-analytics-id
NEXT_PUBLIC_API_URL=your-api-endpoint
```

## 🤝 Contributing

1. Fork → Create feature branch → Implement changes → Test → PR
2. **Standards:** TypeScript strict mode • SCSS styling • Storybook stories • Accessibility compliance
3. **Testing:** Run `pnpm test` and `pnpm type-check` before submitting

## 📄 License

Proprietary software developed for FIA. All rights reserved.

---

**Built for fostering healthier, more aware relationships through comprehensive personality assessment and educational content.**
