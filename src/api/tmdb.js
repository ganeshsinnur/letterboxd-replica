// TMDB API Service Layer
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Extract token from import.meta.env or fallback
const getAuthHeaders = () => {
  const token = import.meta.env.VITE_TMDB_API || process.env.TMDB_API || '';
  return {
    Authorization: `Bearer ${token}`,
    accept: 'application/json',
  };
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path, size = 'w300') => {
  if (!path) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Generic Fetch Wrapper
async function fetchFromTmdb(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error (${res.status}): ${res.statusText}`);
  }

  return res.json();
}

// Movie Endpoints
export async function getNowPlayingMovies(page = 1) {
  return fetchFromTmdb('/movie/now_playing', { page });
}

export async function getPopularMovies(page = 1) {
  return fetchFromTmdb('/movie/popular', { page });
}

export async function getTopRatedMovies(page = 1) {
  return fetchFromTmdb('/movie/top_rated', { page });
}

export async function getUpcomingMovies(page = 1) {
  return fetchFromTmdb('/movie/upcoming', { page });
}

export async function getTrendingMovies(timeWindow = 'day') {
  return fetchFromTmdb(`/trending/movie/${timeWindow}`);
}

// Search Movies
export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) return { results: [] };
  return fetchFromTmdb('/search/movie', { query: query.trim(), page, include_adult: false });
}

// Get Full Movie Details (with credits, videos, similar, reviews, release_dates)
export async function getMovieDetails(movieId) {
  return fetchFromTmdb(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar,reviews,release_dates',
  });
}

// Get Movie Videos / Trailers
export async function getMovieVideos(movieId) {
  return fetchFromTmdb(`/movie/${movieId}/videos`);
}

// Get Movie Credits
export async function getMovieCredits(movieId) {
  return fetchFromTmdb(`/movie/${movieId}/credits`);
}

// Get Popular People / Casts
export async function getPopularPeople(page = 1) {
  return fetchFromTmdb('/person/popular', { page });
}

// Get Person Details (biography & movie credits)
export async function getPersonDetails(personId) {
  return fetchFromTmdb(`/person/${personId}`, {
    append_to_response: 'movie_credits',
  });
}

// Get Genres List
let cachedGenres = null;
export async function getMovieGenres() {
  if (cachedGenres) return cachedGenres;
  try {
    const data = await fetchFromTmdb('/genre/movie/list');
    cachedGenres = data.genres.reduce((acc, g) => {
      acc[g.id] = g.name;
      return acc;
    }, {});
    return cachedGenres;
  } catch (e) {
    return {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western',
    };
  }
}
