import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { API_BASE_URL } from '../../config/apiConfig';
import './../../style/gridStyles.css';

function TrendingAnimes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trendingAnimes, setTrendingAnimes] = useState([]);
  const itemsPerPage = 6; // Number of items per page
  const navigate = useNavigate(); // React Router hook for navigation

  // Fetch the trending animes or get them from localStorage
  useEffect(() => {
    const fetchTrendingAnimes = async () => {
      try {
        // Check if data exists in localStorage
        const cachedData = localStorage.getItem('trendingAnimes');
        if (cachedData) {
          // Use cached data if available
          setTrendingAnimes(JSON.parse(cachedData));
        } else {
          // Fetch from the API if no cached data
          const response = await fetch(`${API_BASE_URL}/aniwatch`);
          const data = await response.json();

          // Save data to localStorage for future use
          localStorage.setItem('trendingAnimes', JSON.stringify(data.trendingAnimes));
          setTrendingAnimes(data.trendingAnimes); // Store fetched data
        }
      } catch (error) {
        console.error('Error fetching trending animes:', error);
      }
    };

    fetchTrendingAnimes();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const totalPages = Math.ceil(trendingAnimes.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex < totalPages ? newIndex : prevIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex >= 0 ? newIndex : prevIndex;
    });
  };

  const handleViewMore = () => {
    navigate('/trending-more'); // Redirect to another page
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  return (
    <div className="anime-container">
      <h2 className="popular-today">Trending Animes</h2>
      <div className="main-content">
        <div className="slider-containers">
          <button className="prev" onClick={handlePrev} disabled={currentIndex === 0}>
            ←
          </button>
          <div className="anime-col-wrapper">
            <div
              className="anime-col"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {trendingAnimes.length > 0 ? (
                trendingAnimes
                  .slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)
                  .map((anime) => (
                    <div key={anime.id} className="anime-item" onClick={() => handleAnimeClick(anime.id)}>
                      <img className="anime-image" src={anime.img} alt={anime.name} />
                      <span className="anime-badge">TV</span>
                      <span className="anime-name">{anime.name}</span>
                    </div>
                  ))
              ) : (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
            </div>
          </div>
          <button className="next" onClick={handleNext} disabled={currentIndex === totalPages - 1}>
            →
          </button>
        </div>
      </div>
      <span className="view-more-container">

      </span>
    </div>
  );
}

export default TrendingAnimes;
