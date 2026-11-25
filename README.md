# Portfolio Template

A minimalist, high-performance personal portfolio built with React 19, Vite, and GSAP.

---

## Features

- **Choreographed Scroll Experience**: Coordinated pinned stages transitioning between Hero, About, and Projects using GSAP ScrollTrigger.
- **Dynamic Island Navigation**: Floating navigation pill featuring smooth layout transitions and Lottie micro-interactions.
- **Perimeter Vector Glint**: Animated highlight effect tracing the silhouette outline on scroll.
- **Interactive Project Collage**: Asymmetrical grid layout with focused hover states and detailed project pages.
- **Performance Focused**: Hardware-accelerated transitions, lazy-loaded detail routes, and zero npm audit vulnerabilities.

---

## Tech Stack

- **Frontend**: React 19, React Router v7
- **Tooling**: Vite 6
- **Motion**: GSAP 3, ScrollTrigger, `@gsap/react`
- **Micro-interactions**: Lottie Web
- **Typography**: Anton, Bebas Neue, Space Grotesk, Outfit

---

## Getting Started

### Prerequisites
- Node.js (version 18 or newer recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/calmyuki/Portfolio-Template.git "Portfolio Template"

# Navigate into project directory
cd "Portfolio Template"

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
├── public/                 # Static assets, images, and Lottie files
├── src/
│   ├── assets/             # Silhouette graphics and path coordinates
│   ├── components/         # Modular React components & CSS files
│   ├── data/               # Project showcase records
│   ├── App.jsx             # Route definitions & app shell
│   └── main.jsx            # Application entrypoint
├── details.md              # In-depth architectural documentation
└── vite.config.js          # Build configuration & path aliases
```

---

## License

This project is open source and available under the terms of the MIT License.
