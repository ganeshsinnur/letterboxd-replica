import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieSection({
  title,
  subtitle,
  movies = [],
  genresMap = {},
  onSelectMovie,
  onWatchTrailer,
  onSeeMore,
  sectionId,
}) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -800 : 800;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section id={sectionId} style={{ padding: '40px 0', position: 'relative' }}>
      <div className="container-custom">
        {/* Section Header matching Figma */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
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
              {title}
            </h2>
            {subtitle && (
              <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px', fontWeight: 500 }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* See more link matching Figma */}
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
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
            >
              <span>See more</span>
              <ChevronRight size={18} color="#BE123C" />
            </button>
          )}
        </div>

        {/* Carousel Container with Left/Right Chevrons matching Figma */}
        <div style={{ position: 'relative' }}>
          {/* Left Arrow */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            style={{
              position: 'absolute',
              left: '-20px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.18)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#BE123C';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#111827';
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Movie Cards List */}
          <div
            ref={scrollRef}
            className="no-scrollbar"
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'calc((100% - (3 * 28px)) / 4)',
              gap: '28px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '8px 4px 20px 4px',
            }}
          >
            {movies.map((movie) => (
              <div key={movie.id} style={{ scrollSnapAlign: 'start', minWidth: '220px' }}>
                <MovieCard
                  movie={movie}
                  genresMap={genresMap}
                  onSelectMovie={onSelectMovie}
                  onWatchTrailer={onWatchTrailer}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: '-20px',
              top: '40%',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.18)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#BE123C';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#111827';
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
