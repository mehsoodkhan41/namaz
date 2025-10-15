# Namaz (Prayer Times Pakistan)

A modern React + TypeScript application that helps users across Pakistan keep track of daily prayer times, Qibla direction, tasbih counts, and essential duas. The experience is optimised for Urdu speakers, with dark mode support and a responsive layout designed for both mobile and desktop users.

## Features

- Accurate daily prayer times for every major city in Pakistan (Aladhan API, University of Islamic Sciences Karachi method).
- Live countdown to the next prayer, with optional browser notifications.
- GPS-based location detection and automatic Qibla direction calculation.
- Built-in digital tasbih counter with quick reset and increment controls.
- Curated duas with Arabic text, Urdu translation, and transliteration.
- Fully localised UI (Urdu-first, English labels where helpful).
- Dark mode toggle and appearance tweaks managed from the settings screen.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (ships with recent Node.js versions)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite will start the development server (default: `http://localhost:5173/`). Hot module replacement is enabled out of the box.

### Build

```bash
npm run build
```

The production build outputs to the `dist/` directory.

## Project Structure

- `src/pages/Home.tsx` – main dashboard (prayer schedule, tasbih, duas, Qibla, GPS integration)
- `src/pages/About.tsx` – overview of the application, technology stack, credits
- `src/pages/Settings.tsx` – dark mode, notifications, and language preferences
- `src/services/prayerTimesApi.ts` – Aladhan Prayer Times API integration
- `src/data/cities.ts` – province and city metadata with coordinates

## Environment Variables

No private keys are required. If you self-host the prayer times API or provide alternate endpoints, wire them up using Vite environment variables (e.g. `.env` with `VITE_API_URL`).

## Roadmap Ideas

- Persist language and tasbih preferences across sessions.
- Decompose Home page widgets into dedicated routes/components.
- Add service worker support for reliable notifications and offline access.
- Extend duas library and allow user-defined entries.
- Improve automated testing (React Testing Library + Vitest).

## License

This project is currently distributed as-is. Add your preferred OSS license (e.g. MIT) if you plan to open-source it formally.
