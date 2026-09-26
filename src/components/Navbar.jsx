import React, { useState, useEffect, useRef } from 'react';
import { Search, Bookmark, CheckCircle2, Menu, X, Film, Star, Heart, SlidersHorizontal, Flame, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { searchMovies, getImageUrl } from '../api/tmdb';

export default function Navbar({
  onOpenWatchlist,
  onOpenWatched,
  onOpenFavorites,
  onSelectMovie,
  onSearchSubmit,
  onNavigateSection,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { watchlist, watched, favorites } = useWatchlist();
  const searchContainerRef = useRef(null);

  // Handle scroll for transparent -> frosted background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search for instant suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchMovies(query, 1);
        setSuggestions(data.results ? data.results.slice(0, 6) : []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Failed to search suggestions', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      onSearchSubmit(query.trim());
    }
  };

  const handleSelectSuggestion = (movie) => {
    setShowDropdown(false);
    setQuery('');
    onSelectMovie(movie.id);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? 'rgba(17, 24, 39, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}
    >
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', gap: '20px' }}>
        {/* Brand Logo matching Figma */}
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#BE123C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(190, 18, 60, 0.5)',
              flexShrink: 0,
            }}
          >
            {/* TV Icon matching Figma */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="20" height="14" rx="3" fill="white" />
              <path d="M8 3L12 7L16 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="3" fill="#BE123C" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: '24px',
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            MovieBox
          </span>
        </div>

        {/* Search Bar matching Figma */}
        <div
          ref={searchContainerRef}
          style={{
            flex: '1',
            maxWidth: '525px',
            position: 'relative',
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid rgba(209, 213, 219, 0.7)',
              borderRadius: '6px',
              padding: '6px 14px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              placeholder="What do you want to watch?"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                width: '100%',
                paddingRight: '10px',
              }}
            />
            <button
              type="submit"
              aria-label="Search movies"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Instant Dropdown Suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: '#1F2937',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Matches</span>
                <span style={{ fontSize: '11px', color: '#BE123C', cursor: 'pointer', fontWeight: 600 }} onClick={handleFormSubmit}>
                  View all results &rarr;
                </span>
              </div>
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {suggestions.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectSuggestion(movie)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <img
                      src={getImageUrl(movie.poster_path, 'w92')}
                      alt={movie.title}
                      style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>
                          {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                        </span>
                        {movie.vote_average > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F5C518', fontSize: '12px', fontWeight: 700 }}>
                            ★ {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Letterboxd Features */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            title="Your Watchlist"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '7px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <Bookmark size={16} fill={watchlist.length > 0 ? '#BE123C' : 'none'} color={watchlist.length > 0 ? '#BE123C' : '#ffffff'} />
            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Watchlist</span>
            {watchlist.length > 0 && (
              <span
                style={{
                  backgroundColor: '#BE123C',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  padding: '1px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Watched / Logged Counter Button */}
          <button
            onClick={onOpenWatched}
            title="Watched / Diary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '7px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <CheckCircle2 size={16} color={watched.length > 0 ? '#10B981' : '#ffffff'} />
            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Watched</span>
            {watched.length > 0 && (
              <span
                style={{
                  backgroundColor: '#10B981',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  padding: '1px 6px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}
              >
                {watched.length}
              </span>
            )}
          </button>

          {/* Menu / Drawer Icon matching Figma */}
          <div
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#BE123C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(190, 18, 60, 0.4)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isMobileMenuOpen ? <X size={20} color="#ffffff" /> : <Menu size={20} color="#ffffff" />}
          </div>
        </div>
      </div>

      {/* Navigation Drawer / Quick Menu */}
      {isMobileMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '80px',
            right: '24px',
            width: '280px',
            backgroundColor: '#111827',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            padding: '16px',
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => {
                onNavigateSection('now-playing');
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Flame size={18} color="#BE123C" /> Now Playing
            </button>

            <button
              onClick={() => {
                onNavigateSection('popular');
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Sparkles size={18} color="#F5C518" /> Popular Movies
            </button>

            <button
              onClick={() => {
                onNavigateSection('top-rated');
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Star size={18} color="#3B82F6" /> Top Rated
            </button>

            <button
              onClick={() => {
                onNavigateSection('upcoming');
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Film size={18} color="#10B981" /> Upcoming Movies
            </button>

            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '6px 0' }} />

            <button
              onClick={() => {
                onOpenFavorites();
                setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                color: '#ffffff',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={18} color="#EF4444" /> Favorites
              </span>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{favorites.length}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
