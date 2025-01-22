import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './../../style/gridStyles.css';

function TopUpcomingAnimes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topUpcomingAnimes, setTopUpcomingAnimes] = useState([]);
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    const fetchTopUpcomingAnimes = async () => {
      // Check if data is already stored in localStorage
      const cachedData = localStorage.getItem('topUpcomingAnimes');
      if (cachedData) {
        setTopUpcomingAnimes(JSON.parse(cachedData)); // Load data from localStorage
        return;
      }

      try {
        const response = await fetch('https://api-hazel-pi.vercel.app/aniwatch');
        const data = await response.json();

        if (data.topUpcomingAnimes) {
          setTopUpcomingAnimes(data.topUpcomingAnimes); // Set the fetched data
          localStorage.setItem('topUpcomingAnimes', JSON.stringify(data.topUpcomingAnimes)); // Save to localStorage
        }
      } catch (error) {
        console.error('Error fetching top upcoming animes:', error);
      }
    };

    fetchTopUpcomingAnimes();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const totalPages = Math.ceil(topUpcomingAnimes.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex < totalPages ? newIndex : prevIndex; // Prevent going past available pages
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex >= 0 ? newIndex : prevIndex; // Prevent going below 0
    });
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`); // Navigate to the Anime Details page with the anime's ID
  };

  return (
    <div className="anime-container">
      <h2 className="popular-today">Top Upcoming Animes</h2>
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
              {/* Render the top upcoming anime items dynamically */}
              {topUpcomingAnimes.length > 0 ? (
                topUpcomingAnimes
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
    </div>
  );
}

export default TopUpcomingAnimes;
