import React from 'react';
import { Heart, Bookmark, Check, Star, Play } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({
  movie,
  genresMap = {},
  onSelectMovie,
  onWatchTrailer,
}) {
  const { isInWatchlist, toggleWatchlist, isFavorite, toggleFavorite, isWatched, toggleWatched, getRating } = useWatchlist();

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);
  const favorited = isFavorite(movie.id);
  const watched = isWatched(movie.id);
  const userRating = getRating(movie.id);

  // Parse release year
  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : movie.first_air_date
    ? movie.first_air_date.split('-')[0]
    : '2024';

  // Format genre string
  const genreNames = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => genresMap[id])
    .filter(Boolean)
    .join(', ') || 'Action, Drama';

  // Score calculations
  const imdbScore = ((movie.vote_average || 7.5) * 10).toFixed(1);
  const rtScore = Math.min(99, Math.max(60, Math.round((movie.vote_average || 7.5) * 11.2)));

  return (
    <div
      className="movie-poster-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => onSelectMovie(movie.id)}
    >
      {/* Poster Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '250 / 370',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#1F2937',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        }}
      >
        <img
          className="poster-img"
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title || movie.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Top Badges & Heart Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          {/* Format / Type Badge matching Figma */}
          <div
            style={{
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(243, 244, 246, 0.75)',
              padding: '3px 8px',
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: '11px',
                color: '#111827',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              {movie.media_type === 'tv' ? 'TV SERIES' : 'MOVIE'}
            </span>
          </div>

          {/* Favorite Heart Button matching Figma */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie);
            }}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: favorited ? '#BE123C' : 'rgba(243, 244, 246, 0.75)',
              backdropFilter: 'blur(6px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart
              size={16}
              fill={favorited ? '#ffffff' : 'none'}
              color={favorited ? '#ffffff' : '#4B5563'}
            />
          </button>
        </div>

        {/* Quick Letterboxd Action Bar (Hover or Active) */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(8px)',
            opacity: inWatchlist || watched || userRating > 0 ? 1 : 0,
            transition: 'opacity 0.25s ease',
            zIndex: 10,
          }}
          className="quick-action-bar"
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {/* Watchlist toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: inWatchlist ? '#BE123C' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            <Bookmark size={14} fill={inWatchlist ? '#BE123C' : 'none'} />
            <span>{inWatchlist ? 'Watchlist' : '+ Watch'}</span>
          </button>

          {/* Watched toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatched(movie);
            }}
            title={watched ? 'Mark unwatched' : 'Mark watched'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: watched ? '#10B981' : '#D1D5DB',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Check size={15} strokeWidth={watched ? 3 : 2} />
          </button>

          {/* User Star rating badge if exists */}
          {userRating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10B981', fontSize: '11px', fontWeight: 800 }}>
              <Star size={12} fill="#10B981" />
              <span>{userRating}★</span>
            </div>
          )}
        </div>
      </div>

      {/* Release Year info matching Figma */}
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '12px',
          color: '#9CA3AF',
        }}
      >
        USA, {releaseYear}
      </div>

      {/* Movie Title matching Figma */}
      <h3
        className="line-clamp-1"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 800,
          fontSize: '18px',
          color: '#111827',
          lineHeight: '1.25',
          margin: 0,
        }}
        title={movie.title || movie.name}
      >
        {movie.title || movie.name}
      </h3>

      {/* Ratings Row matching Figma */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* IMDb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              backgroundColor: '#F5C518',
              color: '#000000',
              fontWeight: 900,
              fontSize: '9px',
              borderRadius: '2px',
              padding: '1px 4px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            IMDb
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '12px',
              color: '#111827',
            }}
          >
            {imdbScore} / 100
          </span>
        </div>

        {/* Rotten Tomatoes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px' }}>🍅</span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '12px',
              color: '#111827',
            }}
          >
            {rtScore}%
          </span>
        </div>
      </div>

      {/* Genre tags matching Figma */}
      <div
        className="line-clamp-1"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '12px',
          color: '#9CA3AF',
        }}
      >
        {genreNames}
      </div>
    </div>
  );
}
