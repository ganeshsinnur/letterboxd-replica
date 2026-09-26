import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getNowPlayingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../api/tmdb';
import MovieCard from './MovieCard';

export default function SeeAllMoviesModal({
  sectionType, // 'now-playing' | 'popular' | 'top-rated' | 'upcoming'
  sectionTitle,
  onClose,
  onSelectMovie,
  onWatchTrailer,
  genresMap = {},
}) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchSectionMovies = async (pageNum) => {
    setLoading(true);
    try {
      let fetchFn = getPopularMovies;
      if (sectionType === 'now-playing') fetchFn = getNowPlayingMovies;
      else if (sectionType === 'top-rated') fetchFn = getTopRatedMovies;
      else if (sectionType === 'upcoming') fetchFn = getUpcomingMovies;

      const data = await fetchFn(pageNum);
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch section movies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionMovies(1);
  }, [sectionType]);

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
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(31, 41, 55, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              {sectionTitle || 'All Movies'}
            </h2>
            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Page {page} of {Math.min(500, totalPages)}</span>
          </div>

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

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {loading ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#9CA3AF' }}>
              <Loader2 className="animate-spin" size={24} color="#BE123C" />
              <span>Loading movies...</span>
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

          {/* Pagination Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '36px' }}>
            <button
              onClick={() => fetchSectionMovies(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: page <= 1 ? 'rgba(255, 255, 255, 0.05)' : '#BE123C',
                color: page <= 1 ? '#6B7280' : '#ffffff',
                border: 'none',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span style={{ color: '#D1D5DB', fontWeight: 600, fontSize: '14px' }}>
              {page} / {Math.min(500, totalPages)}
            </span>

            <button
              onClick={() => fetchSectionMovies(page + 1)}
              disabled={page >= totalPages || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: page >= totalPages ? 'rgba(255, 255, 255, 0.05)' : '#BE123C',
                color: page >= totalPages ? '#6B7280' : '#ffffff',
                border: 'none',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
