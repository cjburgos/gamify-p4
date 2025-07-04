# Gaming Platform - Replit Development Guide

## Overview

This is a smart contract deployment marketplace for PlayOnchain - a gasless, smart contract-powered game arena platform. The application allows GameMasters to browse and deploy game templates to create elimination-style arenas where players compete for stablecoin prizes. Built with React, Express, and PostgreSQL with a retro gaming aesthetic inspired by classic Nintendo games.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom gaming theme variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Request Handling**: Express middleware for logging and error handling
- **Development**: Hot reload with Vite integration in development mode

### Database Architecture
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon serverless database connection
- **Development**: In-memory storage fallback for development

## Key Components

### Database Schema
- **Games Table**: Stores game sessions with details like title, description, entry fees, prize pools, player counts, and lock times
- **Users Table**: User authentication and profile management
- **Schema Location**: `shared/schema.ts` with Zod validation schemas

### API Endpoints
- `GET /api/games` - Retrieve crypto gambling games
- `GET /api/brand-games` - Retrieve brand giveaway games
- `GET /api/sports-games` - Retrieve live sports and event betting games
- `GET /api/games/:id` - Get specific game details
- `POST /api/games` - Create new game session
- `POST /api/games/:id/join` - Join a game session (frontend ready)

### UI Components
- **GameCard**: Display game information with status badges and progress bars
- **GameModal**: Detailed game view with join functionality
- **CountdownTimer**: Real-time countdown to game lock time
- **Tabs Interface**: Three-tab navigation for different game categories
- **Custom UI Components**: Extended Shadcn/ui components with gaming aesthetics

### Game Categories

#### 1. Crypto Games (Random "Known" Games)
- **Dice Games**: Guess the Dice, Number Wizard
- **Card Games**: Pick the Card, Coin Flip Battle
- **Classic Games**: Rock Paper Scissors, Color Wheel Spin
- **Strategy Games**: Crypto Roulette, Lucky Seven
- **Entry**: USDC payments with crypto prize pools

#### 2. Brand Giveaways (Corporate Training & Marketing)
- **TV Game Shows**: Wheel of Fortune, Jeopardy, Deal or No Deal, Price is Right
- **Corporate Training**: Starbucks Barista Training, Adobe Creative Skills Test
- **Brand Marketing**: McDonald's Menu Challenge, Netflix Binge Challenge
- **Product Promotion**: Tesla showcase, Nike wheel, Apple trivia
- **Entry**: Free to play with brand prizes and gift cards

#### 3. Live Sports & Events (Live Event Engagement)
- **Sports Betting**: NFL possession outcomes, World Cup winners, NBA shots, Champions League
- **Concert Engagement**: Taylor Swift song predictions, Grammy Awards
- **Entertainment Events**: Cirque du Soleil acts, Broadway opening nights
- **Awards Shows**: Live Grammy betting, theater premieres
- **Entry**: USDC betting on real-time live events

### Storage System
- **Development**: In-memory storage with sample data (`MemStorage` class)
- **Production**: PostgreSQL with Drizzle ORM
- **Interface**: `IStorage` interface for easy storage backend switching

## Data Flow

1. **Game Browsing**: Frontend fetches games from `/api/games` endpoint
2. **Real-time Updates**: Countdown timers update game status locally
3. **Game Interaction**: Users can view detailed game information via modals
4. **Game Joining**: Join functionality prepared for backend integration
5. **State Management**: TanStack Query handles caching and synchronization

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud database service
- **Connection**: Via `DATABASE_URL` environment variable
- **Fallback**: In-memory storage for development

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: CSS utility for component variants
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Replit Integration**: Runtime error overlay and cartographer
- **ESBuild**: Production bundling for server code
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development Mode
- **Command**: `npm run dev`
- **Server**: Express with Vite middleware for HMR
- **Port**: 5000 (configured in .replit)
- **Database**: In-memory storage with sample data

### Production Build
- **Build Command**: `npm run build`
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles server to `dist/index.js`
- **Start Command**: `npm run start`

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Deployment**: Autoscale deployment target
- **Port Mapping**: Internal 5000 → External 80

## Recent Changes

- June 23, 2025: Complete Flow blockchain integration and game deployment
  - Integrated @onflow/fcl for native Flow wallet authentication with QR code support
  - Built Flow transaction system for deploying games to testnet using GuessTheDiceV2 contract
  - Added game deployment functionality with Flow transaction submission and finalization
  - Created Arena page to display deployed games with Game ID, Game Master, and entry fees
  - Simplified deployment modal to only include Entry Cost field
  - Migrated from localStorage to server-side JSON file storage with polling updates
  - Enhanced transaction processing to extract actual game IDs from GameCreated events
  - Added RESTful API endpoints for deployed game management with real-time updates
  - Implemented Join Game functionality with Flow transactions using real game IDs
  - Added random guess generation and proper transaction parameter passing
  - Implemented PlayerJoined event listening and player address tracking in game data
  - Enhanced game cards to display joined player addresses with proper styling
  - Added backend API endpoint for updating game player lists from blockchain events
  - Enhanced contract reading with detailed logging and better error handling
  - Improved UI styling with high-contrast colors for Pool Size and Players sections
  - Added comprehensive Flow script debugging for activePlayers property reading
  - Updated to GuessTheDiceV3 contract with corrected activePlayers access syntax
  - Implemented real-time player tracking with 2-second polling intervals
  - Added complete game timer and elimination system with configurable countdown
  - Integrated dice guess modal with 10-second input timer and auto-elimination
  - Added game result display showing survival status and dice roll outcomes
  - Updated UI to show "Game Over" for expired games and "Eliminated" for failed players
  - Made game activation time configurable via VITE_GAME_ACTIVATION_TIME_SECONDS environment variable
  - Enhanced button states to show player journey: Join Game → Waiting to Start → Enter Game → Results
  - Implemented proper game state tracking for joined players and started games
  - Redesigned join flow: players reserve spots locally, submit actual guesses when timer expires
  - Added newest-first game ordering with shared dice rolls for all players in same game
  - Enhanced timer display with "GAME STARTING!" animation when countdown reaches zero
  - Improved dice roll result display with prominent dice number and clear survival/elimination status
  - Enhanced guess modal with better visual feedback and timing information
  - Fixed game flow: no auto-guessing, players input their own guesses when game starts
  - Proper separation: join reserves spot, actual gameplay happens after timer expires
  - CRITICAL FIX: Completely rewrote arena.tsx to eliminate all auto-guess generation code
  - Join process now ONLY sets local state, blockchain transactions happen during guess submission
  - Restored complete header navigation while maintaining fixed game flow functionality
  - Fixed shared dice roll system: all players in same game now see identical dice results
  - Added server-side dice result storage and API endpoints for consistent game outcomes
  - Restored player counter display showing number of joined players per game
  - Fixed navigation: removed Home tab, made Marketplace link go to home page
  - Corrected navigation tab order to Arena, Marketplace, Profile, GameMaster
  - Added multi-round elimination logic: games continue until no players survive
  - Implemented automatic round progression when players survive dice rolls
  - Added server endpoint to clear dice results between rounds for fair gameplay
  - Fixed multi-round flow: surviving players automatically continue without clicking "Enter Game"
  - Enhanced elimination tracking to properly mark eliminated players across rounds
  - Added spinning dice animation during result waiting period for better user experience
  - Fixed multi-round modal persistence: surviving players stay in game without reopening modals
  - Implemented round counter display and proper game state management across multiple rounds
  - Enhanced result modal with pulsing animation for round continuation feedback

## Changelog

Changelog:
- June 22, 2025. Initial setup
- June 23, 2025. EVM wallet integration with Flow blockchain support

## User Preferences

Preferred communication style: Simple, everyday language.