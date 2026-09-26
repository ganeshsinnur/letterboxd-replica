import React from 'react';
import { Play, ChevronRight } from 'lucide-react';
import { getBackdropUrl } from '../api/tmdb';

export default function ExclusiveVideosSection({ videos = [], onPlayVideo }) {
  // Default curated or fetched trailers
  const displayVideos = videos.length > 0 ? videos.slice(0, 3) : [
    {
      id: 'v1',
      name: 'John Wick: Chapter 4 - Final Official Trailer',
      key: 'qEVUtrk8_B4',
      site: 'YouTube',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'v2',
      name: 'Dune: Part Two - Official Teaser & Cast Interview',
      key: 'Way9Dexny3w',
      site: 'YouTube',
      thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'v3',
      name: 'Oppenheimer - Behind The Cinematic Scenes',
      key: 'uYPbbksJxIg',
      site: 'YouTube',
      thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section style={{ padding: '40px 0', backgroundColor: '#F9FAFB' }}>
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
            Exclusive Videos
          </h2>
          <button
            onClick={() => onPlayVideo(displayVideos[0])}
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
        </div>

        {/* Video Cards Grid matching Figma */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
          }}
        >
          {displayVideos.map((video, idx) => (
            <div
              key={video.id || idx}
              onClick={() => onPlayVideo(video)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#111827',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}
              >
                <img
                  src={video.backdrop_path ? getBackdropUrl(video.backdrop_path, 'w780') : video.thumbnail || `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  alt={video.name || video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.85)',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Red Circular Play Button matching Figma */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(190, 18, 60, 0.9)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(190, 18, 60, 0.5)',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)';
                    e.currentTarget.style.backgroundColor = '#BE123C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.style.backgroundColor = 'rgba(190, 18, 60, 0.9)';
                  }}
                >
                  <Play size={24} fill="#ffffff" color="#ffffff" style={{ marginLeft: '3px' }} />
                </div>
              </div>

              {/* Video Title matching Figma */}
              <h3
                className="line-clamp-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#111827',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {video.name || video.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
