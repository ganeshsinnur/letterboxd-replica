import React, { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { searchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';

export default function SearchResultsModal({
  initialQuery,
  onClose,
  onSelectMovie,
  onWatchTrailer,
  genresMap = {},
}) {
  const [query, setQuery] = useState(initialQuery || '');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const performSearch = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await searchMovies(searchQuery, pageNum);
      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, 1);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim(), 1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '92vh',
          backgroundColor: '#111827',
          color: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Header Search Input */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(31, 41, 55, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              backgroundColor: '#111827',
              border: '2px solid rgba(190, 18, 60, 0.6)',
              borderRadius: '8px',
              padding: '8px 16px',
              gap: '12px',
            }}
          >
            <Search size={20} color="#BE123C" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies by title, franchise, keywords..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                width: '100%',
              }}
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              Search
            </button>
          </form>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Info */}
        <div style={{ padding: '12px 28px', backgroundColor: 'rgba(17, 24, 39, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
            Found <strong style={{ color: '#ffffff' }}>{totalResults}</strong> movies for "{query}"
          </span>
        </div>

        {/* Grid Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {loading && movies.length === 0 ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#9CA3AF' }}>
              <Loader2 className="animate-spin" size={24} color="#BE123C" />
              <span>Searching TMDB...</span>
            </div>
          ) : movies.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF' }}>
              <p style={{ fontSize: '16px' }}>No movies found matching "{query}". Try a different keyword.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '24px',
              }}
            >
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px',
                    color: '#111827',
                  }}
                >
                  <MovieCard
                    movie={movie}
                    genresMap={genresMap}
                    onSelectMovie={(id) => {
                      onClose();
                      onSelectMovie(id);
                    }}
                    onWatchTrailer={onWatchTrailer}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                onClick={() => performSearch(query, page + 1)}
                disabled={loading}
                className="btn-primary"
                style={{ padding: '10px 28px' }}
              >
                {loading ? 'Loading more...' : 'Load More Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
