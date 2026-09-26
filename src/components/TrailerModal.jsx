import React, { useEffect } from 'react';
import { X, Play } from 'lucide-react';

export default function TrailerModal({ video, movie, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video && !movie) return null;

  const videoKey = video?.key;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 300,
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
          maxWidth: '900px',
          backgroundColor: '#111827',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#BE123C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={14} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>
              {video?.name || movie?.title || 'Official Trailer'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close trailer"
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
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#BE123C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Embed */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000000' }}>
          {videoKey ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={video.name || 'Movie Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>
              <p>No video trailer available for this title on YouTube.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
