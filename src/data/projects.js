export const PROJECTS = [
  {
    id: 'mythos-core',
    title: 'Mythos Core',
    subtitle: 'High-Performance Procedural World Simulation & Engine Core',
    category: 'Systems & Engine',
    year: '2024 — Present',
    status: 'In Active Development',
    logo: '/projects/mythos-logo.png',
    banner: '/projects/mythos-banner.png',
    languages: ['Rust', 'C++20', 'WebAssembly', 'GLSL'],
    about:
      'Mythos Core is a custom engine runtime developed for real-time procedural simulations and physics. It provides a lightweight foundation designed to simulate thousands of interactive entities and dynamic voxel chunks concurrently without frame drops or memory bloat.',
    details:
      'The engine relies on an Entity Component System (ECS) architecture, lock-free parallel execution, and a custom octree for spatial indexing. It can compile both natively for desktop systems and to WebAssembly for direct browser execution.',
  },
  {
    id: 'nor',
    title: 'Nor',
    subtitle: 'Minimalist, Local-First Knowledge OS & Thought Canvas',
    category: 'Productivity OS',
    year: '2024',
    status: 'Stable Release',
    logo: '/projects/nor-logo.png',
    banner: '/projects/nor-banner.png',
    languages: ['TypeScript', 'Rust', 'SQL'],
    about:
      'Nor is a distraction-free markdown notes and knowledge-base application. Built around the concept of a second brain, it allows users to connect ideas through bidirectional links and navigate thoughts via interactive graph views.',
    details:
      'All notes are stored locally as plain text and synced directly between personal devices using local-first CRDT protocols, ensuring complete privacy with zero cloud reliance.',
  },
  {
    id: 'birthdates',
    title: 'Birthdates',
    subtitle: 'Thoughtful Milestone Remembrance & Sentimental Celebration Hub',
    category: 'Life & Milestones',
    year: '2024',
    status: 'Live on Web & iOS',
    logo: '',
    banner: '',
    languages: ['TypeScript', 'JavaScript', 'SQL'],
    about:
      'Birthdates is an application built to keep track of important birthdays, anniversaries, and personal milestones. It calculates exact countdowns across different time zones and lets you schedule reminders and personalized notes.',
    details:
      'It includes tools for organizing contacts into close circles, generating commemorative keepsake cards, and receiving scheduled notifications timed accurately to each recipient local morning.',
  },
  {
    id: 'imprint',
    title: 'Imprint',
    subtitle: 'Cryptographic Provenance Ledger & Digital Asset Notarization',
    category: 'Security & Web3',
    year: '2024',
    status: 'Production',
    logo: '/projects/imprint-logo.png',
    banner: '/projects/imprint-banner.png',
    languages: ['Go (Golang)', 'Solidity', 'TypeScript', 'Python'],
    about:
      'Imprint is a cryptographic provenance tool that creates tamper-proof timestamps for software builds, release assets, and sensitive documents. It lets authors verify file authenticity without disclosing file contents.',
    details:
      'Files are hashed locally using SHA-256 and anchored to decentralized ledgers via Merkle tree proofs. A drag-and-drop web portal and command-line utility allow one-second verification from any machine.',
  },
  {
    id: 'websites',
    title: 'Websites',
    subtitle: 'Curated Showcase of Experimental Digital Experiences & Web Lab',
    category: 'Creative Web & UI',
    year: '2023 — Present',
    status: 'Active Lab',
    logo: '',
    banner: '',
    languages: ['TypeScript', 'JavaScript', 'GLSL', 'HTML/CSS'],
    about:
      'Websites is a curated collection of bespoke web experiences, interactive front-end experiments, and responsive client builds designed and developed by Yuki.',
    details:
      'Every project in this archive focuses on fluid typography, hardware-accelerated shader animations, accessible keyboard interactions, and top-tier Lighthouse performance.',
  },
  {
    id: 'mellow-cafe',
    title: 'Mellow Cafe',
    subtitle: 'Virtual Ambient Workspace, Lo-Fi Study Lounge & Collaborative Focus Room',
    category: 'Productivity & Audio',
    year: '2023 — Present',
    status: 'Live',
    logo: '/projects/mellow-logo.gif',
    banner: '/projects/mellow-banner.png',
    languages: ['JavaScript', 'TypeScript', 'HTML/CSS'],
    about:
      'Mellow Cafe is a virtual study lounge and ambient workspace simulator. It pairs customizable environmental sounds—such as rain against glass, quiet cafe murmur, and fireplace hearths—with lo-fi music and synchronized focus timers.',
    details:
      'Built using the Web Audio API and real-time WebSockets, users can join virtual study rooms with friends or work solo with keyboard-controlled audio stems.',
  },
  {
    id: 'khwabon',
    title: 'Khwabon',
    subtitle: 'Ethereal Nocturnal Dream Journal & Generative Audio-Visual Sanctuary',
    category: 'Generative Art & Sound',
    year: '2024',
    status: 'Live',
    logo: '/projects/khwabon-logo.jpg',
    banner: '/projects/khwabon-banner.jpg',
    languages: ['TypeScript', 'JavaScript', 'Web Audio API'],
    about:
      'Khwabon is a digital dream journal and nocturnal reflective writing space. It allows users to write or voice-record dreams upon waking and pairs each entry with procedural ambient soundscapes and minimal typography.',
    details:
      'The platform tracks sleep and lunar cycles alongside written dreams, keeping all journal entries encrypted client-side for complete personal privacy.',
  },
  {
    id: 'mellow-ai',
    title: 'Mellow Ai',
    subtitle: 'Adaptive Multimodal Cognitive Assistant for High-Leverage Thinking',
    category: 'AI & Cognition',
    year: '2024 — 2025',
    status: 'Private Beta',
    logo: '',
    banner: '',
    languages: ['Python', 'TypeScript', 'C++'],
    about:
      'Mellow Ai is a focused workspace assistant designed to reduce mental clutter for engineers and writers. It transcribes voice streams into structured outlines, summarizes dense technical documentation, and provides contextual coding insights.',
    details:
      'It connects to local and remote language models via streaming WebSockets, operating quietly in the background without intrusive overlays or bloat.',
  },
]
