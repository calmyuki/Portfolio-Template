# Technical Architecture & Implementation Details

This document outlines the codebase structure, state flow, rendering architecture, and animation engine powering the **Red-Portfolio** application.

---

## 1. Technology Stack

- **Core Framework**: React 19 (`react`, `react-dom`)
- **Build Tooling**: Vite 6 (`@vitejs/plugin-react`)
- **Animation System**: GSAP 3 (`gsap`, `@gsap/react`, `ScrollTrigger`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Vector & Micro-Interactions**: Lottie Web (`lottie-web`)
- **Icons**: Lucide React (`lucide-react`) & custom SVG vector paths

---

## 2. Directory Layout

```
Red-Portfolio/
├── public/                 # Static assets, project media, and vector icons
│   ├── projects/           # Normalized banners, logos, and previews
│   ├── cat-hiding.json     # Lottie animation asset for Dynamic Island Navbar
│   └── favicon.svg         # Minimalist vector tab icon
├── src/
│   ├── assets/             # Silhouette imagery & coordinate paths
│   │   ├── about-silhouette.png
│   │   ├── personPath.js   # Extracted SVG path for perimeter glint tracing
│   │   └── person-path.json
│   ├── components/         # Core application components
│   │   ├── About.jsx & .css
│   │   ├── Contact.jsx & .css
│   │   ├── Hero.jsx & .css
│   │   ├── LoadingScreen.jsx & .css
│   │   ├── Navbar.jsx & .module.css
│   │   ├── ProjectDetailPage.jsx & .css
│   │   ├── ProjectsSection.jsx & .css
│   │   ├── ScrollStage.jsx & .css
│   │   └── Starfield.jsx
│   ├── data/
│   │   └── projects.js     # Structured dataset for portfolio projects
│   ├── App.jsx             # Shell layout and route definitions
│   ├── index.css           # Global typography and base CSS reset
│   └── main.jsx            # React root mount and GSAP plugin registration
├── index.html              # Shell HTML with typography and metadata
├── vite.config.js          # Vite configuration with path aliases (`@/`)
└── package.json            # Scripts and dependencies
```

---

## 3. Core Architectural Subsystems

### 3.1. ScrollStage & GSAP ScrollTrigger Orchestration
The primary landing experience is coordinated in `src/components/ScrollStage.jsx`:
- **Viewport Pinning**: The stage container pins during scroll progress.
- **Section Progression**: Interpolates between:
  1. `Hero` (initial entrance, oversized typography clipping)
  2. `About` (silhouette reveal with glowing vector spark following `personPath.js`)
  3. `ProjectsSection` (interactive collage grid)
- **Synchronized Events**:
  - Emits `stage-active-section` custom window events to keep the navigation bar highlighted with scroll position.
  - Listens for `scroll-stage-goto` events to enable smooth programmatic scrolling from external components.

### 3.2. Dynamic Island Navigation (`Navbar.jsx`)
- Fixed pill design with smooth expansion transitions.
- Integrated Lottie cat animation (`cat-hiding.json`) triggered on mouse enter/leave.
- Hysteresis-aware viewport detection ensures consistent active link indicator state.

### 3.3. Project Collage & Detail Routing
- **Collage Grid (`ProjectsSection.jsx`)**: Asymmetrical responsive grid showcasing projects. Hovering over any card spotlights it while softly dimming neighboring entries.
- **Lazy-Loaded Route (`ProjectDetailPage.jsx`)**: Code-split via `React.lazy()` and rendered under React `Suspense`. Displays project metadata, category tags, tech stacks, and external links.

---

## 4. Performance Optimizations

1. **Hardware Acceleration**: Transitions employ CSS `transform` and `opacity` with `will-change` hints to trigger GPU compositor layers.
2. **Reduced Motion Support**: `Hero.jsx` inspects `prefers-reduced-motion: reduce` to skip intense transition timelines for accessibility.
3. **Lazy Asset Loading**: Project images utilize native `loading="lazy"`.
4. **Code Splitting**: Dynamic route chunks reduce initial payload footprint.
