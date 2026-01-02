# Dev Events Hub

A modern platform for discovering and booking developer events including hackathons, meetups, and conferences. Built with Next.js 16, MongoDB, and featuring an interactive WebGL-powered UI.

## Features

- **Event Discovery**: Browse featured developer events from around the world
- **MongoDB Integration**: Store and manage events with proper data validation
- **Booking System**: Email-based event registration with duplicate prevention
- **Modern UI**: Clean, responsive design with animated light rays effect
- **Analytics**: Integrated PostHog for user behavior tracking
- **Type Safety**: Full TypeScript support across the codebase

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Frontend**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose 9.1.1
- **Graphics**: OGL (WebGL) for visual effects
- **Analytics**: PostHog (client and server)
- **Language**: TypeScript 5

## Getting Started

### Prerequisites

- Node.js 20+ installed
- MongoDB connection string (MongoDB Atlas or local instance)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mobin04/Dev-Events.git
cd next-js-practical
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-connection-string
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── lib/            # App-specific constants and utilities
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── EventCard.tsx   # Event display card
│   ├── ExploreBtn.tsx  # Navigation button
│   ├── LightRays.tsx   # WebGL light rays effect
│   └── Navbar.tsx      # Navigation bar
├── database/           # MongoDB models
│   ├── event.model.ts  # Event schema
│   ├── booking.model.ts # Booking schema
│   └── index.ts        # Model exports
├── lib/               # Shared utilities
│   ├── mongodb.ts     # MongoDB connection
│   └── utils.ts       # Helper functions
└── public/            # Static assets
    ├── icons/         # SVG icons
    └── images/        # Event images
```

## Database Models

### Event

- Title, slug, description, overview
- Image URL, venue, location
- Date, time, mode (online/offline/hybrid)
- Audience, agenda, organizer, tags
- Auto-generated timestamps

### Booking

- Event ID (reference to Event)
- Email with validation
- Unique constraint (one booking per email per event)
- Auto-generated timestamps

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import project to Vercel
3. Add `MONGODB_URI` environment variable
4. Deploy

For other platforms, build the project with `npm run build` and deploy the `.next` folder.

## License

This project is private and proprietary.
