import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

const STORAGE_KEYS = {
  WATCHLIST: 'moviebox_watchlist_items',
  WATCHED: 'moviebox_watched_items',
  FAVORITES: 'moviebox_favorites_items',
  REVIEWS: 'moviebox_movie_reviews',
  RATINGS: 'moviebox_movie_ratings',
};

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [watched, setWatched] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ratings, setRatings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATINGS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  // Helpers
  const isInWatchlist = (movieId) => watchlist.some((m) => m.id === Number(movieId));
  const isWatched = (movieId) => watched.some((m) => m.id === Number(movieId));
  const isFavorite = (movieId) => favorites.some((m) => m.id === Number(movieId));
  const getRating = (movieId) => ratings[movieId] || 0;
  const getReview = (movieId) => reviews[movieId] || '';

  const toggleWatchlist = (movie) => {
    if (!movie || !movie.id) return;
    const movieId = Number(movie.id);
    if (isInWatchlist(movieId)) {
      setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
    } else {
      const movieData = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date || movie.first_air_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id) || [],
        overview: movie.overview,
        addedAt: new Date().toISOString(),
      };
      setWatchlist((prev) => [movieData, ...prev]);
    }
  };

  const toggleWatched = (movie) => {
    if (!movie || !movie.id) return;
    const movieId = Number(movie.id);
    if (isWatched(movieId)) {
      setWatched((prev) => prev.filter((m) => m.id !== movieId));
    } else {
      const movieData = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date || movie.first_air_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id) || [],
        overview: movie.overview,
        watchedAt: new Date().toISOString(),
      };
      setWatched((prev) => [movieData, ...prev]);
      // Remove from watchlist when marked watched
      setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
    }
  };

  const toggleFavorite = (movie) => {
    if (!movie || !movie.id) return;
    const movieId = Number(movie.id);
    if (isFavorite(movieId)) {
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    } else {
      const movieData = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date || movie.first_air_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id) || [],
        overview: movie.overview,
        favoritedAt: new Date().toISOString(),
      };
      setFavorites((prev) => [movieData, ...prev]);
    }
  };

  const setMovieRating = (movieId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  const setMovieReview = (movieId, reviewText) => {
    setReviews((prev) => ({
      ...prev,
      [movieId]: reviewText,
    }));
  };

  const removeMovieReview = (movieId) => {
    setReviews((prev) => {
      const copy = { ...prev };
      delete copy[movieId];
      return copy;
    });
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watched,
        favorites,
        ratings,
        reviews,
        isInWatchlist,
        isWatched,
        isFavorite,
        getRating,
        getReview,
        toggleWatchlist,
        toggleWatched,
        toggleFavorite,
        setMovieRating,
        setMovieReview,
        removeMovieReview,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
