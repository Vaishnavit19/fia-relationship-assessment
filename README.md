# 🏆 FIA Relationship Assessment

**Discover your relationship style through travel scenarios.** An interactive assessment that reveals how you balance emotional connection, logical planning, and adventurous exploration in relationships.

## ✨ Features

- **Interactive Travel Scenarios**: 7 engaging scenarios that reveal relationship dynamics
- **Dynamic Question Flow**: Smart branching logic that adapts to your responses
- **Three Relationship Archetypes**: Heartfelt Companion 💝, Strategic Navigator 🧠, Spontaneous Explorer 🌟
- **Comprehensive Results**: Detailed analysis with vulnerability insights and persona mapping
- **Responsive Design**: Optimized for all devices with modern UI/UX
- **Privacy-First**: Secure data handling with comprehensive privacy protections
- **Legal Compliance**: Full Terms of Service and Privacy Policy documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fia-relationship-assessment

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix ESLint issues
pnpm format       # Format code with Prettier
pnpm type-check   # Run TypeScript compiler

# Component Development
pnpm storybook    # Start Storybook component library
```

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── assessment/       # Assessment flow page
│   ├── results/          # Results display page
│   ├── terms/           # Terms of Service page
│   ├── privacy/         # Privacy Policy page
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # Reusable UI components
│   ├── pages/           # Page-specific components
│   │   ├── AssessmentPage/
│   │   ├── TabbedResultsPage/
│   │   ├── TermsOfService/    # New: Terms of Service component
│   │   └── PrivacyPolicy/     # New: Privacy Policy component
│   └── assessment/      # Assessment-specific components
├── data/                # Static data and configurations
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── store/               # Zustand state management
├── styles/              # SCSS styles and design system
│   ├── globals.scss     # Global styles and CSS reset
│   ├── variables.scss   # Design system variables
│   └── mixins.scss      # SCSS mixins and utilities
├── public/              # Static assets
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

## 📄 Legal Documentation

### Terms of Service

- **Location**: `/terms` route, `src/components/pages/TermsOfService/`
- **Features**: Comprehensive terms covering service usage, user responsibilities, and liability
- **Integration**: Linked in user registration form for required consent
- **Components**: Print-friendly formatting, accessible design, contact information

### Privacy Policy

- **Location**: `/privacy` route, `src/components/pages/PrivacyPolicy/`
- **Features**: Detailed privacy protections, data handling practices, user rights
- **Integration**: Required consent checkbox in user information form
- **Compliance**: GDPR considerations, data retention policies, user control options

Both legal documents include:

- Professional styling with consistent branding
- Print-friendly versions for offline reference
- Accessibility features and responsive design
- Clear contact information for legal inquiries
- Regular update mechanisms with user notification

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
   - **New**: Required consent to Terms of Service and Privacy Policy
3. **Assessment Flow**: 7 travel-based scenarios with branching logic
4. **Results Page**: Detailed archetype results with score breakdown
5. **Sharing**: Easy sharing of results and option to retake
6. **Legal Pages**: Access to Terms of Service and Privacy Policy via `/terms` and `/privacy`

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

- **Technical Issues**: Create GitHub issues for bugs and feature requests
- **Privacy Questions**: support@fia-relationship-assessment.com (Subject: Privacy Policy Inquiry)
- **Legal Questions**: support@fia-relationship-assessment.com (Subject: Terms of Service Inquiry)
- **Documentation**: Check Storybook documentation

Response time: 5 business days for legal/privacy inquiries

---

**Built with ❤️ for understanding relationships better**
