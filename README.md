# FIA Relationship Assessment

A modern relationship assessment tool that uses travel scenarios to analyze relationship dynamics and discover how you balance emotional connection, logical planning, and adventurous exploration.

## 🎯 Features

- **Interactive Travel Scenarios**: 7 carefully crafted scenarios that reveal relationship patterns
- **Dynamic Branching Logic**: Questions adapt based on your previous answers
- **Three Relationship Archetypes**: Heartfelt Companion, Strategic Navigator, Spontaneous Explorer
- **Beautiful Modern UI**: Clean, professional design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Progress Tracking**: Visual progress indicators and ability to go back
- **Shareable Results**: Easy sharing of assessment results
- **Type-Safe**: Built with TypeScript for reliability

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: SCSS with custom design system (no Tailwind)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Development**: Storybook for component development
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fia-relationship-assessment

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
open http://localhost:3000
```

### Development

pnpm dev # Start development server
pnpm build # Build for production
pnpm start # Start production server
pnpm lint # Run ESLint
pnpm type-check # TypeScript validation

# Storybook

pnpm storybook # Start Storybook development
pnpm build-storybook # Build Storybook for deployment

```

## 📁 Project Structure

```

fia-relationship-assessment/
├── .storybook/ # Storybook configuration
├── src/
│ ├── app/ # Next.js App Router pages
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Homepage
│ │ ├── assessment/ # Assessment flow
│ │ └── results/ # Results page
│ ├── components/ # React components
│ │ ├── ui/ # Reusable UI components
│ │ ├── assessment/ # Assessment-specific components
│ │ ├── results/ # Results-specific components
│ │ └── layout/ # Layout components
│ ├── lib/ # Utilities and logic
│ │ ├── types.ts # TypeScript definitions
│ │ ├── store.ts # Zustand state management
│ │ ├── data.ts # Data loading functions
│ │ └── utils.ts # Helper functions
│ ├── data/ # JSON data files
│ │ ├── scenarios.json # Assessment scenarios
│ │ ├── archetypes.json # Relationship archetypes
│ │ └── config.json # App configuration
│ └── styles/ # SCSS stylesheets
│ ├── globals.scss # Global styles
│ ├── variables.scss # Design system variables
│ └── mixins.scss # SCSS mixins and utilities
├── public/ # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md

````

## 🎨 Design System

The project uses a custom SCSS-based design system with:

- **Modern Color Palette**: Gradient-based design with consistent color tokens
- **Typography Scale**: Responsive typography with Inter font
- **Component Library**: Reusable components with consistent styling
- **Responsive Grid**: Flexible grid system for all screen sizes
- **Animation System**: Smooth transitions and micro-interactions

### Key Design Principles
- Clean and approachable interface
- Gamified experience with progress tracking
- Card-based layout for information hierarchy
- Consistent spacing and typography scales
- Accessible color contrast and interactive states

## 🧠 Assessment Logic

### Scoring System
Each answer is scored across three dimensions:
- **Emotional Score** (0-2 points): Feelings, connection, partner's happiness
- **Logical Score** (0-2 points): Practical thinking, efficiency, planning
- **Exploratory Score** (0-2 points): Spontaneity, adventure, independence

### Branching Logic
- Dynamic question flow based on previous answers
- Questions 2 leads to different city scenarios (London/Paris)
- Delay scenarios branch into waiting vs. going ahead
- All paths converge for final scenarios

### Relationship Archetypes

1. **The Heartfelt Companion** 💝
   - Prioritizes emotional connection and togetherness
   - Partner's happiness is their happiness
   - Creates deep bonds through shared experiences

2. **The Strategic Navigator** 🧠
   - Approaches relationships with careful planning
   - Makes efficient, logic-based decisions
   - Creates well-organized adventures

3. **The Spontaneous Explorer** 🌟
   - Embraces the unexpected and thrives on new experiences
   - Comfortable with uncertainty and change
   - Brings excitement through adventurous approach

## 🔧 Development Guide

### Component Development
Components are developed using Storybook for isolated development and testing:

```bash
# Start Storybook
pnpm storybook
````

### State Management

The app uses Zustand for state management with persistence:

- Assessment progress and answers
- User data collection
- Results calculation
- Navigation state

### Styling Approach

- SCSS with modern `@use` syntax
- Component-scoped styles with CSS modules
- Global design system in `styles/` directory
- Responsive-first approach with mobile breakpoints

### Type Safety

Full TypeScript coverage with:

- Strict type checking enabled
- Interface definitions for all data structures
- Type-safe state management
- Component prop validation

## 🚀 Deployment

### Build and Deploy

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

### Environment Variables

Create `.env.local` for local development:

```env
# Optional: Analytics or tracking IDs
NEXT_PUBLIC_GA_ID=your-analytics-id

# Optional: API endpoints for data submission
NEXT_PUBLIC_API_URL=your-api-endpoint
```

## 🎯 Usage

1. **Homepage**: Introduction to the assessment with feature overview
2. **User Registration**: Simple form to collect name and optional email
3. **Assessment Flow**: 7 travel-based scenarios with branching logic
4. **Results Page**: Detailed archetype results with score breakdown
5. **Sharing**: Easy sharing of results and option to retake

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Standards

- Follow TypeScript strict mode
- Use SCSS for styling (no inline styles)
- Write Storybook stories for new components
- Test responsive behavior
- Maintain accessibility standards

## 📄 License

This project is proprietary software developed for FIA. All rights reserved.

## 🆘 Support

For support and questions:

<!-- - Email: support@fia-relationship-assessment.com -->

- Documentation: Check Storybook documentation
- Issues: Create GitHub issues for bugs and feature requests

---

**Built with ❤️ for understanding relationships better** Commands

```bash
# Development
```
