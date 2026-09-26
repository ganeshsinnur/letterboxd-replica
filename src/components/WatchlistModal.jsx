import React, { useState } from 'react';
import {
  X,
  Bookmark,
  CheckCircle2,
  Heart,
  Star,
  Trash2,
  Film,
  Search,
  ArrowUpDown,
  Filter,
  Download,
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../api/tmdb';

export default function WatchlistModal({
  initialTab = 'watchlist',
  onClose,
  onSelectMovie,
  genresMap = {},
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, rating-desc, title-asc
  const [genreFilter, setGenreFilter] = useState('all');

  const {
    watchlist,
    watched,
    favorites,
    ratings,
    reviews,
    toggleWatchlist,
    toggleWatched,
    toggleFavorite,
    getRating,
    getReview,
  } = useWatchlist();

  let currentItems = [];
  if (activeTab === 'watchlist') currentItems = watchlist;
  else if (activeTab === 'watched') currentItems = watched;
  else if (activeTab === 'favorites') currentItems = favorites;
  else if (activeTab === 'reviews') {
    // items that have reviews or ratings
    const allMovies = [...watchlist, ...watched, ...favorites];
    const uniqueMap = new Map();
    allMovies.forEach((m) => uniqueMap.set(m.id, m));
    currentItems = Array.from(uniqueMap.values()).filter(
      (m) => ratings[m.id] || reviews[m.id]
    );
  }

  // Filter items
  let filteredItems = currentItems.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesGenre = genreFilter === 'all' || (movie.genre_ids && movie.genre_ids.includes(Number(genreFilter)));
    return matchesSearch && matchesGenre;
  });

  // Sort items
  filteredItems.sort((a, b) => {
    if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'rating-desc') return (b.vote_average || 0) - (a.vote_average || 0);
    if (sortBy === 'user-rating-desc') return (ratings[b.id] || 0) - (ratings[a.id] || 0);
    return new Date(b.addedAt || b.watchedAt || b.favoritedAt || 0) - new Date(a.addedAt || a.watchedAt || a.favoritedAt || 0);
  });

  // Export as JSON
  const handleExport = () => {
    const data = {
      watchlist,
      watched,
      favorites,
      ratings,
      reviews,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moviebox-letterboxd-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
          maxWidth: '1000px',
          maxHeight: '90vh',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(31, 41, 55, 0.7)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              My Cinema Collection
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '4px 0 0 0' }}>
              Your personal Letterboxd-style movie diary, watchlist & ratings
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleExport}
              title="Export Watchlist Data"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              <span>Export</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                width: '36px',
                height: '36px',
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
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('watchlist')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              backgroundColor: activeTab === 'watchlist' ? '#BE123C' : 'transparent',
              color: '#ffffff',
              transition: 'all 0.2s ease',
            }}
          >
            <Bookmark size={16} fill={activeTab === 'watchlist' ? '#ffffff' : 'none'} />
            <span>Watchlist ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watched')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              backgroundColor: activeTab === 'watched' ? '#10B981' : 'transparent',
              color: '#ffffff',
              transition: 'all 0.2s ease',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Watched Diary ({watched.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              backgroundColor: activeTab === 'favorites' ? '#EF4444' : 'transparent',
              color: '#ffffff',
              transition: 'all 0.2s ease',
            }}
          >
            <Heart size={16} fill={activeTab === 'favorites' ? '#ffffff' : 'none'} />
            <span>Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px',
              backgroundColor: activeTab === 'reviews' ? '#8B5CF6' : 'transparent',
              color: '#ffffff',
              transition: 'all 0.2s ease',
            }}
          >
            <Star size={16} fill={activeTab === 'reviews' ? '#ffffff' : 'none'} />
            <span>Ratings & Notes ({Object.keys(ratings).length + Object.keys(reviews).length})</span>
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '12px 24px',
            backgroundColor: '#1F2937',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search in this list..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                outline: 'none',
                fontSize: '14px',
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Genre Filter */}
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="all">All Genres</option>
              {Object.entries(genresMap).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="date-desc">Recently Added</option>
              <option value="rating-desc">Highest TMDB Rating</option>
              <option value="user-rating-desc">My Star Rating</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Content List Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF' }}>
              <Film size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                No movies in {activeTab} yet
              </h3>
              <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                Explore movies on the home page and click the bookmark, check, or heart icons to build your collection!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredItems.map((movie) => {
                const userRating = getRating(movie.id);
                const userReview = getReview(movie.id);

                return (
                  <div
                    key={movie.id}
                    onClick={() => {
                      onClose();
                      onSelectMovie(movie.id);
                    }}
                    style={{
                      position: 'relative',
                      backgroundColor: '#1F2937',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {/* Poster */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 3', backgroundColor: '#111827' }}>
                      <img
                        src={getImageUrl(movie.poster_path, 'w342')}
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Quick Delete / Toggle Action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeTab === 'watchlist') toggleWatchlist(movie);
                          else if (activeTab === 'watched') toggleWatched(movie);
                          else if (activeTab === 'favorites') toggleFavorite(movie);
                        }}
                        title="Remove from list"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BE123C')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Movie Info */}
                    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF' }}>
                        <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                        {userRating > 0 ? (
                          <span style={{ color: '#10B981', fontWeight: 800 }}>★ {userRating}/5</span>
                        ) : movie.vote_average ? (
                          <span style={{ color: '#F5C518', fontWeight: 700 }}>★ {movie.vote_average.toFixed(1)}</span>
                        ) : null}
                      </div>

                      {userReview && (
                        <div style={{ fontSize: '11px', color: '#D1D5DB', fontStyle: 'italic', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          "{userReview}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
