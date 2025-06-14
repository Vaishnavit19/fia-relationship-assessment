# FIA Relationship Assessment

A sophisticated relationship assessment tool that uses travel scenarios to analyze personality patterns and provide educational content about relationship vulnerabilities. The system combines advanced mathematical algorithms with educational psychology to deliver personalized insights about manipulation patterns and relationship safety.

## 🎯 Features

- **Dynamic Travel Scenarios**: 25 scenarios with intelligent branching logic and 4 multi-select questions
- **Advanced Branching Logic**: Questions adapt based on previous answers with London vs Paris pathways
- **Eight Comprehensive Archetypes**: Achiever, Intellectual, Leader, Explorer, Peacemaker, Dreamer, Rebel, Caregiver
- **Vulnerability Education**: 17 educational manipulation personas with pop culture references
- **Mathematical Precision**: Euclidean distance calculations for accurate personality matching
- **Three-Tab Results Interface**: Archetypes, Vulnerabilities, and Attraction Patterns
- **Beautiful Modern UI**: Clean, professional design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Progress Tracking**: Visual progress indicators with adaptive completion (16-19 questions)
- **Educational Value**: Red flag recognition and protection strategies
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

### Development Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript validation

# Storybook
pnpm storybook        # Start Storybook development
pnpm build-storybook  # Build Storybook for deployment
```

## 📁 Project Structure

```
fia-relationship-assessment/
├── .storybook/           # Storybook configuration
├── src/
│ ├── app/                # Next.js App Router pages
│ │ ├── layout.tsx        # Root layout
│ │ ├── page.tsx          # Homepage
│ │ ├── assessment/       # Assessment flow
│ │ └── results/          # Results page
│ ├── components/         # React components
│ │ ├── pages/            # Page-level components
│ │ │ ├── HomePage/
│ │ │ ├── AssessmentPage/
│ │ │ ├── TabbedResultsPage/
│ │ │ ├── VulnerabilityCardsPage/
│ │ │ └── EnhancedResultsPage/
│ │ └── ui/               # Reusable UI components
│ │   ├── Button/
│ │   ├── Card/
│ │   ├── LoadingSpinner/
│ │   ├── PageLayout/
│ │   ├── Modal/
│ │   ├── ProgressBar/
│ │   ├── AssessmentProgress/
│ │   ├── NavigationControls/
│ │   ├── OptionButton/
│ │   ├── QuestionCard/
│ │   ├── UserInfoForm/
│ │   ├── ArchetypeCard/
│ │   ├── ResultsSummary/
│ │   ├── ScoreChart/
│ │   └── ShareButtons/
│ ├── lib/                # Utilities and logic
│ │ ├── types.ts          # TypeScript definitions
│ │ ├── store.ts          # Zustand state management
│ │ ├── data.ts           # Data loading functions
│ │ ├── archetypeCalculator.ts    # Mathematical algorithms
│ │ ├── personaSelector.ts        # Vulnerability selection
│ │ ├── personaEducator.ts        # Educational content
│ │ └── vulnerabilityPipeline.ts  # Assessment pipeline
│ ├── data/               # JSON data files
│ │ ├── extended-travel-scenarios.json    # 25 travel scenarios
│ │ ├── extended-archetypes.json          # 8 archetype definitions
│ │ ├── archetype-scoring-profiles.json   # Mathematical profiles
│ │ ├── enhanced-persona-cards.json       # 17 manipulation personas
│ │ └── persona-archetype-mapping.json    # Vulnerability mappings
│ └── styles/             # SCSS stylesheets
│ ├── globals.scss        # Global styles
│ ├── variables.scss      # Design system variables
│ └── mixins.scss         # SCSS mixins and utilities
├── public/               # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

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

### Advanced Branching Logic

- **25 total scenarios** with complex decision tree structure
- **4 multi-select scenarios** requiring multiple choice selections
- **2 major branching points**: London vs Paris pathways create personalized experiences
- **Delay scenarios** branch into waiting vs going-ahead paths
- **Adaptive completion**: Assessment completes at 16-19 questions based on user path
- **Convergence points** bring different paths back together

### Mathematical Archetype Matching

- **Euclidean distance calculation** for personality proximity
- **Confidence percentages** based on distance ratios
- **Top 3-5 matches** displayed with detailed analysis
- **Tie-breaking algorithms** for close matches

### Eight Relationship Archetypes

1. **The Achiever** 🎯

   - Goal-oriented and success-driven
   - Builds relationships through shared ambitions
   - Values efficiency and strategic planning

2. **The Intellectual** 🧠

   - Values deep conversations and mental connection
   - Approaches relationships analytically
   - Seeks intellectual compatibility

3. **The Leader** 👑

   - Takes charge naturally in relationships
   - Creates structure and direction
   - Protective and decision-oriented

4. **The Explorer** 🌟

   - Seeks adventure and growth together
   - Embraces spontaneity and new experiences
   - Values freedom and discovery

5. **The Peacemaker** 🕊️

   - Maintains harmony and prevents conflict
   - Prioritizes emotional connection
   - Accommodating and supportive

6. **The Dreamer** 💭

   - Builds relationships around shared visions
   - Creative and idealistic approach
   - Values meaning and possibility

7. **The Rebel** ⚡

   - Values authenticity and freedom
   - Challenges conventional relationship norms
   - Independent and non-conformist

8. **The Caregiver** 💝
   - Nurtures and supports others naturally
   - Finds fulfillment in caring for partners
   - Emotionally generous and protective

## 🛡️ Vulnerability Education System

### Educational Personas

- **17 manipulation personas** with detailed psychological profiles
- **Pop culture references** for easy recognition and retention
- **Risk-level assessment** (high, medium, low) based on archetype vulnerability
- **Protection strategies** tailored to individual patterns

### Persona Selection Algorithm

- **Confidence gap analysis**: Determines persona distribution
- **Weighted selection**: Prioritizes high-risk patterns for user's archetype
- **3-5 personas selected** based on mathematical analysis
- **Educational content generation** with recognition signs and protection tips

### Three-Tab Results Interface

1. **Archetypes Tab**: Personality analysis with confidence scores and detailed profiles
2. **Vulnerabilities Tab**: Personalized manipulation awareness education
3. **Attraction Patterns Tab**: Relationship dynamic insights (coming soon)

## 🔧 Development Guide

### Component Development

Components are developed using Storybook for isolated development and testing:

```bash
# Start Storybook
pnpm storybook
```

### State Management

The app uses Zustand for state management with persistence:

- Assessment progress and answers
- User data collection
- Results calculation
- Vulnerability assessment state
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

## 🎯 Usage Flow

1. **Homepage**: Introduction to the enhanced assessment with feature overview
2. **User Registration**: Simple form to collect name and optional email
3. **Assessment Flow**: 25 travel-based scenarios with intelligent branching (16-19 questions)
4. **Results Processing**: Mathematical archetype calculation and vulnerability analysis
5. **Three-Tab Results**: Comprehensive personality analysis and educational content
6. **Sharing & Actions**: Easy sharing of results and option to retake

## 🔄 System Architecture

### Core Data Files

1. **extended-travel-scenarios.json**: 25 scenarios with branching logic
2. **extended-archetypes.json**: 8 archetype definitions with traits
3. **archetype-scoring-profiles.json**: Mathematical matching algorithms
4. **enhanced-persona-cards.json**: 17 educational manipulation personas
5. **persona-archetype-mapping.json**: Vulnerability mapping system

### Processing Pipeline

1. **Answer Collection**: User responses to travel scenarios
2. **Score Calculation**: Three-dimensional scoring (emotional, logical, exploratory)
3. **Archetype Matching**: Euclidean distance calculation for personality proximity
4. **Confidence Analysis**: Gap calculation between top matches
5. **Persona Selection**: Risk-based educational content selection
6. **Results Generation**: Comprehensive three-tab interface with educational value

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
- Validate algorithm accuracy for assessment components

## 📊 System Performance

- **Assessment Time**: 16-19 questions (average 18 questions)
- **Completion Rate**: Optimized for high engagement
- **Accuracy**: Mathematical precision with confidence scoring
- **Educational Value**: Comprehensive vulnerability awareness training
- **Personalization**: Tailored content based on individual archetype profiles

## 🆘 Support

For support and questions:

- Documentation: Check Storybook documentation
- Issues: Create GitHub issues for bugs and feature requests

## 📄 License

This project is proprietary software developed for FIA. All rights reserved.

---

**Built with ❤️ for understanding relationships better through advanced personality assessment and educational awareness**
