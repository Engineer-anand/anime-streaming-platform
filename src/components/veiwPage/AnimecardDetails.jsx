import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './../style/Card.css'; // Ensure you have your styling in place

const AnimecardDetails = ({ anime, onClick, type }) => {
  const navigate = useNavigate();

  // Ensure anime prop is available and valid
  if (!anime) {
    console.error('No anime data found!');
    return <p></p>; // Display message if anime prop is missing
  }

  const handleCardClick = () => {
    // Use onClick if provided, otherwise navigate directly
    if (onClick) {
      onClick(anime.id); // Pass anime ID on click
    } else {
      navigate(`/anime/${anime.id}`); // Default navigation to anime detail page
    }
  };

  return (
    <div
      className={`anime-card ${type}`} // Type can be "season", "related", etc.
      onClick={handleCardClick} // Navigate on card click
      style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', transition: 'transform 0.3s ease' }}
    >
      {/* Image of the anime */}
      <div className="card-image" style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
        <img 
          src={anime.img || '/default-image.png'} 
          alt={anime.name || 'Anime Image'}
          style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px' }} 
        />
      </div>

      {/* Content below image */}
      <div className="card-content" style={{ padding: '10px' }}>
        {/* Anime Name */}
        <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
          {anime.name || 'Unknown Anime'}
        </h4>

        {/* Anime Category (if available) */}
        {anime.category && <p style={{ fontSize: '1rem', color: '#777' }}>{anime.category}</p>}

        {/* Display number of Episodes (if available) */}
        {anime.episodes && (
          <>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              Episodes: {anime.episodes.eps || 'N/A'}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              Dub: {anime.episodes.dub || 'N/A'}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#555' }}>
              Sub: {anime.episodes.sub || 'N/A'}
            </p>
          </>
        )}

        {/* Optional: Add duration and rated information if available */}
      </div>

      {/* Optional: Add hover effect on the card */}
      <style>
        {`
          .anime-card:hover {
            transform: scale(1.05); /* Zoom in slightly on hover */
          }
        `}
      </style>
    </div>
  );
};

export default AnimecardDetails;
