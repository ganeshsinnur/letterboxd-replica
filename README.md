# 🎬 MovieBox — Letterboxd Replica

A modern, responsive movie discovery and watchlist platform inspired by **Letterboxd** and built with **React.js**, **Vite**, and the **TMDB API**.

---

## ✨ Features

- **Hero Banner & Featured Carousel**: Dynamic hero header showcasing trending movies with IMDb and Rotten Tomatoes ratings, synopsis, and trailer playback.
- **Movie Subsections**:
  - 🍿 **Now Playing in Theaters**: Current cinema releases (`/movie/now_playing`)
  - ⭐ **Featured & Popular**: Top trending movies worldwide (`/movie/popular`)
  - 🏆 **Top Rated All-Time Classics**: Highest rated films (`/movie/top_rated`)
  - 🚀 **New Arrival & Upcoming**: Anticipated releases (`/movie/upcoming`)
  - 🎥 **Exclusive Videos**: Trailers & behind-the-scenes previews
  - 🌟 **Featured Casts**: Popular actors & profile filmographies (`/person/popular`)
- **Live Search**: Instant debounced search with live dropdown suggestions and full paginated results.
- **Letterboxd-style Tracking & Diary**:
  - Add to **Watchlist**
  - Mark as **Watched / Diary**
  - **Favorites** collection
  - **5-Star Interactive Rating System**
  - Personal **Review & Viewing Notes** logger
  - Data Export to JSON
- **Full Movie Details Modal**: High-res backdrop, poster, IMDb/RT scores, overview, director & screenwriter credits, top billed cast avatars, YouTube trailer player, and similar movie recommendations.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (or yarn/pnpm)

---

### 2. Get Your TMDB API Key / Token

1. Create a free account at [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Navigate to **Account Settings** &rarr; **API** ([https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)).
3. Generate an API Key / **API Read Access Token (v4 auth)**.

---

### 3. Environment Setup

Create a `.env` file in the root directory (or copy `.env.example`):

```bash
cp .env.example .env
```

Add your TMDB API Read Access Token to `.env`:

```env
TMDB_API=your_tmdb_api_read_access_token_here
```

---

### 4. Installation & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: React.js (React 19)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **API**: The Movie Database (TMDB) API
- **Fonts**: DM Sans & Inter (Google Fonts)
- **Styling**: Vanilla CSS with custom design tokens

---

## 🎨 Design Attribution

UI design referenced from the **MovieBox Figma Community Template** by *Adriana Eka Prayudha*.
