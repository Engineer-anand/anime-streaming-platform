# NexAnime — Full-Featured Anime Streaming Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![HLS.js](https://img.shields.io/badge/Streaming-HLS.js-FF6F00?logo=html5&logoColor=white)](https://github.com/video-dev/hls.js/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance, responsive anime streaming web application built with **React 18** and **Vite**. NexAnime delivers a seamless media consumption experience with adaptive bitrate video streaming via HLS, multi-source server fallback, subtitle and audio (Sub/Dub) switching, smart client-side caching, and dynamic search discovery.

---

## 🚀 Key Features

- **Adaptive Bitrate Streaming (HLS.js)**: Integrated HTTP Live Streaming with dynamic quality switching (360p, 480p, 720p, 1080p) and automatic manifest parsing.
- **Dual-Audio & Multi-Subtitle Support**: Seamlessly toggle between **Sub** (subtitled) and **Dub** (dubbed) streaming streams with multi-language subtitle tracks.
- **Smart Client-Side Caching**: Uses `localStorage` persistence for anime details, episode lists, and spotlight carousels, significantly reducing redundant network calls and providing near-instant subsequent loads.
- **Dynamic Content Discovery & Search**: Real-time anime search with an interactive dropdown overlay and category-based sorting.
- **Paginated Episode Navigation**: Clean, intuitive episode selector with pagination and automatic playback synchronization.
- **Curated Categorization**: Dynamic grids for *Trending Now*, *Top 10 (Day/Week/Month)*, *Latest Episodes*, *Most Popular*, and *Top Upcoming*.
- **Secure & Configurable Architecture**: Fully decoupled backend architecture with zero hardcoded endpoints, parameterized via environment variables (`.env`).
- **Responsive Modern UI**: Custom CSS design system with mobile-first breakpoints, smooth transitions, and accessibility-minded layout.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Core** | React 18, JSX, JavaScript (ES6+) |
| **Build & Tooling** | Vite, ESLint |
| **Routing** | React Router DOM v7 |
| **Video & Streaming** | HLS.js, HTML5 Video API, Video.js, JWPlayer React |
| **HTTP Client** | Axios, Fetch API |
| **Styling & Icons** | Vanilla CSS3 (Custom Design System), FontAwesome |
| **State Management** | React Hooks (`useState`, `useEffect`, `useRef`, `useParams`, `useLocation`, `useNavigate`) |
| **Storage & Cache** | Web Storage API (`localStorage`) |

---

## 📂 Project Architecture

```plaintext
FULLANIMEWEBSITE/
├── public/                     # Static public assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Animegrid/          # Grids: Top10, Trending, MostPopular, Upcoming
│   │   ├── veiwPage/           # Recommendation & details cards
│   │   ├── Footer.jsx          # Footer with navigation and links
│   │   ├── Header.jsx          # Header with search & responsive navigation
│   │   ├── InnerHome.jsx       # Featured spotlight slider & curated feeds
│   │   ├── MainPage.jsx        # Landing hero banner & quick search
│   │   ├── sidebar.jsx         # Top 10 anime tabbed sidebar (day/week/month)
│   │   └── VideoPlayer.jsx     # HLS video player with quality & sub/dub toggle
│   ├── config/
│   │   └── apiConfig.js        # Centralized API environment configurations
│   ├── pages/
│   │   ├── AnimeDetails.jsx    # Anime overview, seasons, related titles
│   │   ├── AnimeEpisode.jsx    # Episode watcher with paginated selector
│   │   ├── AnimeSearch.jsx     # Search discovery view
│   │   └── Home.jsx            # Main app page router
│   ├── services/
│   │   └── api.js              # Central API service handlers
│   ├── style/                  # Modular CSS stylesheets
│   ├── App.jsx                 # Route definitions and layout wrapper
│   └── main.jsx                # Application root entry
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules (protects credentials)
├── package.json                # Project dependencies and scripts
└── vite.config.js              # Vite configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Engineer-anand/FULLANIMEWEBSITE.git
   cd FULLANIMEWEBSITE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure your API endpoints:
   ```env
   VITE_API_BASE_URL=https://your-anime-api.com/api
   VITE_RECOMMENDED_API_URL=https://your-anime-api.com/api/random
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.