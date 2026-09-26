import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getProfileUrl } from '../api/tmdb';

export default function FeaturedCastsSection({ casts = [], onSelectPerson, onSeeMore }) {
  if (!casts || casts.length === 0) return null;

  const displayCasts = casts.slice(0, 4);

  return (
    <section style={{ padding: '50px 0', backgroundColor: '#ffffff' }}>
      <div className="container-custom">
        {/* Header matching Figma */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 800,
              color: '#000000',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            Featured Casts
          </h2>
          {onSeeMore && (
            <button
              onClick={onSeeMore}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                color: '#BE123C',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>See more</span>
              <ChevronRight size={18} color="#BE123C" />
            </button>
          )}
        </div>

        {/* Casts Grid matching Figma */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
          }}
        >
          {displayCasts.map((cast) => (
            <div
              key={cast.id}
              onClick={() => onSelectPerson(cast.id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Picture with Poster Mask / Aspect ratio matching Figma */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '250 / 370',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#E5E7EB',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={getProfileUrl(cast.profile_path, 'h632')}
                  alt={cast.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Actor Name matching Figma */}
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '18px',
                  color: '#111827',
                  margin: 0,
                }}
              >
                {cast.name}
              </h3>

              {/* Known For / Character */}
              {cast.known_for && cast.known_for.length > 0 && (
                <p
                  className="line-clamp-1"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#9CA3AF',
                    margin: 0,
                  }}
                >
                  {cast.known_for.map((m) => m.title || m.name).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
