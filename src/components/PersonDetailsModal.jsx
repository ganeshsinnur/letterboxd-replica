import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Film, Star } from 'lucide-react';
import { getPersonDetails, getProfileUrl, getImageUrl } from '../api/tmdb';

export default function PersonDetailsModal({ personId, onClose, onSelectMovie }) {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) return;
    let isMounted = true;
    setLoading(true);

    getPersonDetails(personId)
      .then((data) => {
        if (isMounted) {
          setPerson(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load person details', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [personId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!personId) return null;

  const knownForMovies = person?.movie_credits?.cast
    ? [...person.movie_credits.cast]
        .filter((m) => m.poster_path)
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 12)
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 250,
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
          maxWidth: '850px',
          maxHeight: '90vh',
          backgroundColor: '#111827',
          color: '#ffffff',
          borderRadius: '16px',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '32px',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BE123C')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
        >
          <X size={18} />
        </button>

        {loading ? (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
            Loading cast details...
          </div>
        ) : person ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '140px',
                  height: '190px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#1F2937',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src={getProfileUrl(person.profile_path, 'h632')}
                  alt={person.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  {person.name}
                </h2>
                <div style={{ color: '#BE123C', fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
                  {person.known_for_department || 'Acting'}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {person.birthday && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '13px' }}>
                      <Calendar size={14} />
                      <span>{person.birthday}</span>
                    </div>
                  )}
                  {person.place_of_birth && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '13px' }}>
                      <MapPin size={14} />
                      <span>{person.place_of_birth}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Biography */}
            {person.biography && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Biography</h3>
                <p className="line-clamp-4" style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  {person.biography}
                </p>
              </div>
            )}

            {/* Known For Movies */}
            {knownForMovies.length > 0 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Known For</h3>
                <div
                  className="no-scrollbar"
                  style={{
                    display: 'flex',
                    gap: '14px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                  }}
                >
                  {knownForMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => {
                        onClose();
                        onSelectMovie(movie.id);
                      }}
                      style={{
                        width: '110px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1F2937' }}>
                        <img
                          src={getImageUrl(movie.poster_path, 'w342')}
                          alt={movie.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
