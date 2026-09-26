import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MovieSection from './components/MovieSection';
import ExclusiveVideosSection from './components/ExclusiveVideosSection';
import FeaturedCastsSection from './components/FeaturedCastsSection';
import MovieDetailsModal from './components/MovieDetailsModal';
import TrailerModal from './components/TrailerModal';
import PersonDetailsModal from './components/PersonDetailsModal';
import WatchlistModal from './components/WatchlistModal';
import SearchResultsModal from './components/SearchResultsModal';
import SeeAllMoviesModal from './components/SeeAllMoviesModal';
import Footer from './components/Footer';

import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getPopularPeople,
  getMovieGenres,
  getMovieVideos,
} from './api/tmdb';

export default function App() {
  // Movie data states
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [casts, setCasts] = useState([]);
  const [genresMap, setGenresMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals & Active selections
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [activeTrailer, setActiveTrailer] = useState(null); // { key, name } or null
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  
  const [watchlistModalOpen, setWatchlistModalOpen] = useState(false);
  const [watchlistModalTab, setWatchlistModalTab] = useState('watchlist');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [seeAllSection, setSeeAllSection] = useState(null); // { type, title } or null

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [
          nowPlayingData,
          popularData,
          topRatedData,
          upcomingData,
          peopleData,
          genresData,
        ] = await Promise.all([
          getNowPlayingMovies(1).catch(() => ({ results: [] })),
          getPopularMovies(1).catch(() => ({ results: [] })),
          getTopRatedMovies(1).catch(() => ({ results: [] })),
          getUpcomingMovies(1).catch(() => ({ results: [] })),
          getPopularPeople(1).catch(() => ({ results: [] })),
          getMovieGenres().catch(() => ({})),
        ]);

        setNowPlaying(nowPlayingData.results || []);
        setPopular(popularData.results || []);
        setTopRated(topRatedData.results || []);
        setUpcoming(upcomingData.results || []);
        setCasts(peopleData.results || []);
        setGenresMap(genresData || {});
      } catch (err) {
        console.error('Failed to load initial movie data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle trailer opening (fetches YouTube key if not provided)
  const handleWatchTrailer = async (movie, explicitVideo = null) => {
    if (explicitVideo) {
      setActiveTrailer(explicitVideo);
      setActiveTrailerMovie(movie);
      return;
    }
    if (!movie || !movie.id) return;

    try {
      const vids = await getMovieVideos(movie.id);
      const ytTrailer = vids.results?.find(
        (v) => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type)
      ) || vids.results?.[0];

      if (ytTrailer) {
        setActiveTrailer(ytTrailer);
      } else {
        // Fallback trailer search
        setActiveTrailer({
          key: 'qEVUtrk8_B4', // default trailer fallback
          name: `${movie.title || movie.name} - Trailer`,
        });
      }
      setActiveTrailerMovie(movie);
    } catch (err) {
      console.error('Error fetching trailer', err);
      setActiveTrailer({
        key: 'qEVUtrk8_B4',
        name: `${movie.title || movie.name} - Trailer`,
      });
      setActiveTrailerMovie(movie);
    }
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSearchModalOpen(true);
  };

  const handleNavigateSection = (sectionKey) => {
    const el = document.getElementById(sectionKey);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      let title = 'Movies';
      if (sectionKey === 'now-playing') title = 'Now Playing Movies';
      else if (sectionKey === 'popular') title = 'Featured & Popular Movies';
      else if (sectionKey === 'top-rated') title = 'Top Rated Movies';
      else if (sectionKey === 'upcoming') title = 'Upcoming Releases';
      setSeeAllSection({ type: sectionKey, title });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar matching Figma */}
      <Navbar
        onOpenWatchlist={() => {
          setWatchlistModalTab('watchlist');
          setWatchlistModalOpen(true);
        }}
        onOpenWatched={() => {
          setWatchlistModalTab('watched');
          setWatchlistModalOpen(true);
        }}
        onOpenFavorites={() => {
          setWatchlistModalTab('favorites');
          setWatchlistModalOpen(true);
        }}
        onSelectMovie={(id) => setSelectedMovieId(id)}
        onSearchSubmit={handleSearchSubmit}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero Banner Header matching Figma */}
      <HeroBanner
        movies={popular.length > 0 ? popular : nowPlaying}
        onSelectMovie={(id) => setSelectedMovieId(id)}
        onWatchTrailer={handleWatchTrailer}
      />

      {/* Main Content Sections matching Figma and User Request */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {/* Section 1: Featured Movie / Popular */}
        <MovieSection
          sectionId="popular"
          title="Featured Movie"
          subtitle="Top trending worldwide favorites right now"
          movies={popular}
          genresMap={genresMap}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onWatchTrailer={handleWatchTrailer}
          onSeeMore={() => setSeeAllSection({ type: 'popular', title: 'Featured Movies' })}
        />

        {/* Section 2: Now Playing */}
        <MovieSection
          sectionId="now-playing"
          title="Now Playing in Theaters"
          subtitle="Latest releases currently in cinemas"
          movies={nowPlaying}
          genresMap={genresMap}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onWatchTrailer={handleWatchTrailer}
          onSeeMore={() => setSeeAllSection({ type: 'now-playing', title: 'Now Playing in Theaters' })}
        />

        {/* Section 3: New Arrival / Upcoming matching Figma */}
        <MovieSection
          sectionId="upcoming"
          title="New Arrival & Upcoming"
          subtitle="Anticipated blockbusters coming soon"
          movies={upcoming}
          genresMap={genresMap}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onWatchTrailer={handleWatchTrailer}
          onSeeMore={() => setSeeAllSection({ type: 'upcoming', title: 'Upcoming Releases' })}
        />

        {/* Section 4: Exclusive Videos matching Figma */}
        <ExclusiveVideosSection
          onPlayVideo={(video) => {
            setActiveTrailer(video);
            setActiveTrailerMovie({ title: video.name });
          }}
        />

        {/* Section 5: Top Rated */}
        <MovieSection
          sectionId="top-rated"
          title="Top Rated All-Time Classics"
          subtitle="Highest critically acclaimed films according to audiences"
          movies={topRated}
          genresMap={genresMap}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onWatchTrailer={handleWatchTrailer}
          onSeeMore={() => setSeeAllSection({ type: 'top-rated', title: 'Top Rated All-Time Classics' })}
        />

        {/* Section 6: Featured Casts matching Figma */}
        <FeaturedCastsSection
          casts={casts}
          onSelectPerson={(id) => setSelectedPersonId(id)}
          onSeeMore={() => {
            if (casts.length > 0) setSelectedPersonId(casts[0].id);
          }}
        />
      </main>

      {/* Footer matching Figma */}
      <Footer />

      {/* Modals */}
      {/* 1. Movie Full Details Modal */}
      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onSelectPerson={(id) => setSelectedPersonId(id)}
          onWatchTrailer={handleWatchTrailer}
        />
      )}

      {/* 2. Trailer Modal */}
      {activeTrailer && (
        <TrailerModal
          video={activeTrailer}
          movie={activeTrailerMovie}
          onClose={() => {
            setActiveTrailer(null);
            setActiveTrailerMovie(null);
          }}
        />
      )}

      {/* 3. Cast / Person Profile Modal */}
      {selectedPersonId && (
        <PersonDetailsModal
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
          onSelectMovie={(id) => {
            setSelectedPersonId(null);
            setSelectedMovieId(id);
          }}
        />
      )}

      {/* 4. Watchlist & Letterboxd Diary Modal */}
      {watchlistModalOpen && (
        <WatchlistModal
          initialTab={watchlistModalTab}
          onClose={() => setWatchlistModalOpen(false)}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          genresMap={genresMap}
        />
      )}

      {/* 5. Search Results Modal */}
      {searchModalOpen && (
        <SearchResultsModal
          initialQuery={searchQuery}
          onClose={() => setSearchModalOpen(false)}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onWatchTrailer={handleWatchTrailer}
          genresMap={genresMap}
        />
      )}

      {/* 6. See All / Category View Modal */}
      {seeAllSection && (
        <SeeAllMoviesModal
          sectionType={seeAllSection.type}
          sectionTitle={seeAllSection.title}
          onClose={() => setSeeAllSection(null)}
          onSelectMovie={(id) => setSelectedMovieId(id)}
          onWatchTrailer={handleWatchTrailer}
          genresMap={genresMap}
        />
      )}
    </div>
  );
}
