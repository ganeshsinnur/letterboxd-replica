import React, { useState, useEffect } from 'react';
import { Play, Info, Bookmark, Heart, Star, Check } from 'lucide-react';
import { getBackdropUrl, getMovieVideos } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function HeroBanner({ movies, onSelectMovie, onWatchTrailer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const heroMovies = movies.slice(0, 5);
  const currentMovie = heroMovies[currentIndex] || heroMovies[0];

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  // Auto-advance hero slides every 6 seconds unless hovered
  useEffect(() => {
    if (heroMovies.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length, isHovered]);

  if (!currentMovie) {
    return (
      <div style={{ height: '600px', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#9CA3AF', fontSize: '18px' }}>Loading featured movies...</div>
      </div>
    );
  }

  // Calculate IMDB style rating & Rotten Tomatoes score
  const imdbScore = ((currentMovie.vote_average || 8.0) * 10).toFixed(1);
  const rtScore = Math.min(99, Math.max(65, Math.round((currentMovie.vote_average || 8.0) * 11)));
  const inWatchlist = isInWatchlist(currentMovie.id);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '620px',
        maxHeight: '750px',
        height: '80vh',
        backgroundColor: '#111827',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* Background Backdrop Image */}
      <div
        key={currentMovie.id}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${getBackdropUrl(currentMovie.backdrop_path, 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'brightness(0.85)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Cinematic Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%), linear-gradient(0deg, rgba(17,24,39,1) 0%, rgba(17,24,39,0.3) 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content Container */}
      <div className="container-custom" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10, paddingTop: '40px' }}>
        <div
          key={`content-${currentMovie.id}`}
          className="animate-fade-in"
          style={{
            maxWidth: '520px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Release Year & Featured Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#BE123C', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Featured Today
            </span>
            <span style={{ color: '#D1D5DB', fontSize: '14px', fontWeight: 600 }}>
              {currentMovie.release_date ? currentMovie.release_date.split('-')[0] : '2024'}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              margin: 0,
            }}
          >
            {currentMovie.title}
          </h1>

          {/* Ratings matching Figma */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginTop: '2px' }}>
            {/* IMDB */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  backgroundColor: '#F5C518',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '10px',
                  borderRadius: '3px',
                  padding: '1px 5px',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                IMDb
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                {imdbScore} / 100
              </span>
            </div>

            {/* Rotten Tomatoes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px' }}>🍅</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }}>
                {rtScore}%
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <p
            className="line-clamp-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              lineHeight: 1.55,
              color: '#E5E7EB',
              maxWidth: '440px',
              margin: 0,
            }}
          >
            {currentMovie.overview || 'No synopsis available for this title.'}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px', flexWrap: 'wrap' }}>
            {/* Watch Trailer Button matching Figma */}
            <button
              onClick={() => onWatchTrailer(currentMovie)}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              <Play size={18} fill="#ffffff" />
              <span>Watch Trailer</span>
            </button>

            {/* More Info */}
            <button
              onClick={() => onSelectMovie(currentMovie.id)}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Info size={18} />
              <span>Details</span>
            </button>

            {/* Watchlist Quick Toggle */}
            <button
              onClick={() => toggleWatchlist(currentMovie)}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '6px',
                backgroundColor: inWatchlist ? '#BE123C' : 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Bookmark size={18} fill={inWatchlist ? '#ffffff' : 'none'} />
            </button>
          </div>
        </div>

        {/* Vertical Pagination Bar matching Figma */}
        <div
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 20,
          }}
        >
          {heroMovies.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                {isActive && (
                  <div
                    style={{
                      width: '18px',
                      height: '3px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                    }}
                  />
                )}
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: isActive ? '16px' : '12px',
                    color: isActive ? '#ffffff' : '#9CA3AF',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
