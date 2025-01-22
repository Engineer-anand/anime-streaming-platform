import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './../../style/gridStyles.css';

function Top10Animes() {
  const [top10Animes, setTop10Animes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Number of items in one slide
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    const fetchTop10Animes = async () => {
      try {
        // Check if data is already saved in localStorage
        const cachedData = localStorage.getItem('top10Animes');
        if (cachedData) {
          // Parse and set data from localStorage
          setTop10Animes(JSON.parse(cachedData));
        } else {
          // If no data in localStorage, fetch from the API
          const response = await fetch('https://api-hazel-pi.vercel.app/aniwatch');
          const data = await response.json();

          // Save the data in localStorage
          localStorage.setItem('top10Animes', JSON.stringify(data.top10Animes.month));
          setTop10Animes(data.top10Animes.month); // Set the fetched data
        }
      } catch (error) {
        console.error('Error fetching top 10 animes for the month:', error);
      }
    };

    fetchTop10Animes();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex * itemsPerPage >= top10Animes.length) {
        return prevIndex;
      }
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexValue = prevIndex - 1;
      if (prevIndexValue < 0) {
        return 0;
      }
      return prevIndexValue;
    });
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  return (
    <div className="anime-container">
      <h2 className="popular-today">Top 10 Animes (This Month)</h2>
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
              {top10Animes.length > 0 ? (
                top10Animes
                  .slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)
                  .map((anime) => (
                    <div
                      key={anime.id}
                      className="anime-item"
                      onClick={() => handleAnimeClick(anime.id)}
                    >
                      <img className="anime-image" src={anime.img} alt={anime.name} />
                      <span className="anime-badge">#{anime.rank}</span>
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
          <button
            className="next"
            onClick={handleNext}
            disabled={currentIndex * itemsPerPage >= top10Animes.length - itemsPerPage}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Top10Animes;
