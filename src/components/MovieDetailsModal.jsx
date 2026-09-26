import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Bookmark,
  Heart,
  Check,
  Star,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Share2,
  Film,
  User,
  Sparkles,
} from 'lucide-react';
import { getMovieDetails, getBackdropUrl, getImageUrl, getProfileUrl } from '../api/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieDetailsModal({
  movieId,
  onClose,
  onSelectMovie,
  onSelectPerson,
  onWatchTrailer,
}) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review & Rating local states
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewInput, setReviewInput] = useState('');
  const [isEditingReview, setIsEditingReview] = useState(false);

  const {
    isInWatchlist,
    toggleWatchlist,
    isWatched,
    toggleWatched,
    isFavorite,
    toggleFavorite,
    getRating,
    setMovieRating,
    getReview,
    setMovieReview,
    removeMovieReview,
  } = useWatchlist();

  useEffect(() => {
    if (!movieId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getMovieDetails(movieId)
      .then((data) => {
        if (isMounted) {
          setMovie(data);
          setReviewInput(getReview(movieId) || '');
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load movie details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movieId) return null;

  const currentRating = movie ? getRating(movie.id) : 0;
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;
  const watched = movie ? isWatched(movie.id) : false;
  const favorited = movie ? isFavorite(movie.id) : false;
  const savedReview = movie ? getReview(movie.id) : '';

  // Extract key crew members
  const directors = movie?.credits?.crew?.filter((c) => c.job === 'Director') || [];
  const writers = movie?.credits?.crew?.filter((c) => ['Screenplay', 'Writer', 'Author', 'Story'].includes(c.job)) || [];
  const producers = movie?.credits?.crew?.filter((c) => ['Producer', 'Executive Producer'].includes(c.job)).slice(0, 3) || [];
  const castList = movie?.credits?.cast?.slice(0, 10) || [];
  const trailers = movie?.videos?.results?.filter((v) => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type)) || [];
  const similarMovies = movie?.similar?.results?.slice(0, 6) || [];

  // Runtime format (e.g. 2h 10m)
  const formatRuntime = (mins) => {
    if (!mins) return 'N/A';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleSaveReview = () => {
    if (movie) {
      setMovieReview(movie.id, reviewInput);
      setIsEditingReview(false);
    }
  };

  const handleDeleteReview = () => {
    if (movie) {
      removeMovieReview(movie.id);
      setReviewInput('');
      setIsEditingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie?.title,
        text: movie?.overview,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1050px',
          maxHeight: '92vh',
          backgroundColor: '#111827',
          color: '#ffffff',
          borderRadius: '16px',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 30,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#BE123C';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid rgba(190, 18, 60, 0.2)',
                  borderTopColor: '#BE123C',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span style={{ color: '#9CA3AF', fontSize: '15px' }}>Loading movie details...</span>
            </div>
          </div>
        ) : error || !movie ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h3 style={{ color: '#EF4444', fontSize: '20px', marginBottom: '12px' }}>Failed to load movie</h3>
            <p style={{ color: '#9CA3AF' }}>{error || 'Movie not found.'}</p>
          </div>
        ) : (
          <div>
            {/* Header Backdrop Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(17,24,39,0.3) 0%, rgba(17,24,39,0.85) 70%, #111827 100%)',
                }}
              />

              {/* Quick Trailer Play Button on Backdrop */}
              {trailers.length > 0 && (
                <button
                  onClick={() => onWatchTrailer(movie, trailers[0])}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    borderRadius: '40px',
                    backgroundColor: 'rgba(190, 18, 60, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '15px',
                    letterSpacing: '0.5px',
                    boxShadow: '0 8px 30px rgba(190, 18, 60, 0.5)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)';
                    e.currentTarget.style.backgroundColor = '#BE123C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(190, 18, 60, 0.92)';
                  }}
                >
                  <Play size={20} fill="#ffffff" />
                  <span>PLAY TRAILER</span>
                </button>
              )}
            </div>

            {/* Main Content Area */}
            <div style={{ padding: '0 32px 40px 32px', marginTop: '-120px', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 260px) 1fr', gap: '36px' }}>
                {/* Left Column: Poster & Quick Letterboxd Action Card */}
                <div>
                  <div
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: '#1F2937',
                    }}
                  >
                    <img
                      src={getImageUrl(movie.poster_path, 'w500')}
                      alt={movie.title}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>

                  {/* Letterboxd Action Panel */}
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '20px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(31, 41, 55, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Log & Track
                    </div>

                    {/* Action Buttons Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {/* Watched */}
                      <button
                        onClick={() => toggleWatched(movie)}
                        title={watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 4px',
                          borderRadius: '8px',
                          backgroundColor: watched ? '#10B981' : 'rgba(255, 255, 255, 0.06)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Check size={18} strokeWidth={watched ? 3 : 2} />
                        <span>{watched ? 'Watched' : 'Watch'}</span>
                      </button>

                      {/* Watchlist */}
                      <button
                        onClick={() => toggleWatchlist(movie)}
                        title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 4px',
                          borderRadius: '8px',
                          backgroundColor: inWatchlist ? '#BE123C' : 'rgba(255, 255, 255, 0.06)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Bookmark size={18} fill={inWatchlist ? '#ffffff' : 'none'} />
                        <span>Watchlist</span>
                      </button>

                      {/* Favorite */}
                      <button
                        onClick={() => toggleFavorite(movie)}
                        title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 4px',
                          borderRadius: '8px',
                          backgroundColor: favorited ? '#EF4444' : 'rgba(255, 255, 255, 0.06)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 700,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Heart size={18} fill={favorited ? '#ffffff' : 'none'} />
                        <span>Like</span>
                      </button>
                    </div>

                    {/* Star Rating Section (Letterboxd Style) */}
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#D1D5DB' }}>Your Rating</span>
                        {currentRating > 0 && (
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981' }}>
                            {currentRating} / 5 Stars
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating || currentRating) >= star;
                          return (
                            <button
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setMovieRating(movie.id, star === currentRating ? 0 : star)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                transition: 'transform 0.15s ease',
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.25)')}
                              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                              <Star
                                size={22}
                                fill={isFilled ? '#10B981' : 'none'}
                                color={isFilled ? '#10B981' : '#6B7280'}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#D1D5DB',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '4px',
                      }}
                    >
                      <Share2 size={14} />
                      <span>Share Movie</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Title, Metadata, Overview, Cast, Crew, Reviews */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Title & Tagline */}
                  <div>
                    <h2
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 'clamp(26px, 4vw, 36px)',
                        fontWeight: 800,
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {movie.title}
                    </h2>
                    {movie.tagline && (
                      <p
                        style={{
                          fontStyle: 'italic',
                          color: '#9CA3AF',
                          fontSize: '15px',
                          marginTop: '6px',
                          margin: '6px 0 0 0',
                        }}
                      >
                        "{movie.tagline}"
                      </p>
                    )}
                  </div>

                  {/* Metadata Badges (Year, Runtime, Cert, Genres) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {movie.release_date && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#D1D5DB', fontSize: '14px', fontWeight: 600 }}>
                        <Calendar size={15} color="#9CA3AF" />
                        {movie.release_date.split('-')[0]}
                      </span>
                    )}
                    {movie.runtime > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#D1D5DB', fontSize: '14px', fontWeight: 600 }}>
                        <Clock size={15} color="#9CA3AF" />
                        {formatRuntime(movie.runtime)}
                      </span>
                    )}
                    {movie.genres?.map((g) => (
                      <span
                        key={g.id}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '14px',
                          padding: '3px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#E5E7EB',
                        }}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>

                  {/* Ratings Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '12px 18px', backgroundColor: 'rgba(31, 41, 55, 0.6)', borderRadius: '10px' }}>
                    {/* IMDb Score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ backgroundColor: '#F5C518', color: '#000', fontWeight: 900, fontSize: '11px', padding: '2px 5px', borderRadius: '3px' }}>
                        IMDb
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>
                        {(movie.vote_average * 10).toFixed(1)} / 100
                      </span>
                    </div>

                    {/* Rotten Tomatoes */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>🍅</span>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>
                        {Math.min(99, Math.max(60, Math.round(movie.vote_average * 11.2)))}%
                      </span>
                    </div>

                    {/* TMDB Votes */}
                    <div style={{ color: '#9CA3AF', fontSize: '13px' }}>
                      {movie.vote_count?.toLocaleString()} votes
                    </div>
                  </div>

                  {/* Synopsis / Overview */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      Overview
                    </h3>
                    <p style={{ color: '#D1D5DB', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
                      {movie.overview || 'No synopsis provided.'}
                    </p>
                  </div>

                  {/* Key Crew Details (Directors, Writers, Producers) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    {directors.length > 0 && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Director</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                          {directors.map((d) => d.name).join(', ')}
                        </div>
                      </div>
                    )}
                    {writers.length > 0 && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Screenplay / Writers</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                          {writers.slice(0, 3).map((w) => w.name).join(', ')}
                        </div>
                      </div>
                    )}
                    {producers.length > 0 && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Producers</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                          {producers.map((p) => p.name).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Top Billed Cast */}
                  {castList.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
                        Top Cast
                      </h3>
                      <div
                        className="no-scrollbar"
                        style={{
                          display: 'flex',
                          gap: '14px',
                          overflowX: 'auto',
                          paddingBottom: '8px',
                        }}
                      >
                        {castList.map((cast) => (
                          <div
                            key={cast.id}
                            onClick={() => onSelectPerson && onSelectPerson(cast.id)}
                            style={{
                              flexShrink: 0,
                              width: '100px',
                              cursor: onSelectPerson ? 'pointer' : 'default',
                              textAlign: 'center',
                            }}
                          >
                            <div
                              style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto 8px auto',
                                border: '2px solid rgba(255, 255, 255, 0.15)',
                                backgroundColor: '#1F2937',
                              }}
                            >
                              <img
                                src={getProfileUrl(cast.profile_path, 'w185')}
                                alt={cast.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cast.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cast.character}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Letterboxd Notes & Review Section */}
                  <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(31, 41, 55, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Your Diary / Review Note
                      </h3>
                      {savedReview && !isEditingReview && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setIsEditingReview(true)}
                            style={{ background: 'transparent', border: 'none', color: '#BE123C', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={handleDeleteReview}
                            style={{ background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditingReview || !savedReview ? (
                      <div>
                        <textarea
                          rows={3}
                          value={reviewInput}
                          onChange={(e) => setReviewInput(e.target.value)}
                          placeholder="Write your review, thoughts, or viewing notes (Letterboxd style)..."
                          style={{
                            width: '100%',
                            backgroundColor: '#111827',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            padding: '10px 12px',
                            fontSize: '14px',
                            fontFamily: "'DM Sans', sans-serif",
                            outline: 'none',
                            resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                          {savedReview && (
                            <button
                              onClick={() => {
                                setReviewInput(savedReview);
                                setIsEditingReview(false);
                              }}
                              style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={handleSaveReview}
                            className="btn-primary"
                            style={{ padding: '6px 16px', fontSize: '13px' }}
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ backgroundColor: '#111827', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #BE123C' }}>
                        <p style={{ margin: 0, color: '#E5E7EB', fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                          {savedReview}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Similar Movies Carousel */}
                  {similarMovies.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
                        More Like This
                      </h3>
                      <div
                        className="no-scrollbar"
                        style={{
                          display: 'flex',
                          gap: '14px',
                          overflowX: 'auto',
                          paddingBottom: '8px',
                        }}
                      >
                        {similarMovies.map((sim) => (
                          <div
                            key={sim.id}
                            onClick={() => onSelectMovie(sim.id)}
                            style={{
                              flexShrink: 0,
                              width: '120px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1F2937' }}>
                              <img
                                src={getImageUrl(sim.poster_path, 'w342')}
                                alt={sim.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sim.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
