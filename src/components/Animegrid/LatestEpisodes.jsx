import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../style/gridStyles.css';

function LatestEpisodes() {
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Page state for pagination
  const [totalPages, setTotalPages] = useState(1); // Default to 1 page
  const itemsPerPage = 6; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestEpisodes = async () => {
      // Check if data is already in localStorage
      const cachedData = localStorage.getItem(`latestEpisodesPage${page}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setLatestEpisodes((prevEpisodes) => [...prevEpisodes, ...parsedData.latestEpisodes]);
        setTotalPages(parsedData.totalPages || 1);
        return;
      }

      if (loading || page > totalPages) return;

      setLoading(true);
      try {
        const response = await fetch(`https://api-hazel-pi.vercel.app/aniwatch/?page=${page}`);
        const data = await response.json();

        if (data.latestEpisodes) {
          // Append new episodes to the existing list
          setLatestEpisodes((prevEpisodes) => [...prevEpisodes, ...data.latestEpisodes]);

          // Cache the fetched data in localStorage
          localStorage.setItem(
            `latestEpisodesPage${page}`,
            JSON.stringify({ latestEpisodes: data.latestEpisodes, totalPages: data.totalPages })
          );
        }

        // Set total pages from the response if it exists
        if (data.totalPages) {
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching latest episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEpisodes();
  }, [page, loading, totalPages]);

  const handleNext = () => {
    if (currentIndex < Math.ceil(latestEpisodes.length / itemsPerPage) - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1); // Go to the next page within the fetched data
    } else if (page < totalPages) {
      setPage(page + 1); // Fetch more data when we reach the end of the current list
      setCurrentIndex(0); // Reset to the first item of the new page
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Ensure it doesn't go below 0
  };

  const handleEpisodeClick = (episodeId) => {
    navigate(`/episode/${episodeId}`); // Navigate to the episode details page
  };

  return (
    <div className="anime-container">
      <h2 className="popular-today">Latest Episodes</h2>
      <div className="main-content">
        <div className="slider-containers">
          <button
            className="prev"
            onClick={handlePrev}
            disabled={loading || currentIndex === 0}
          >
            ←
          </button>
          <div className="anime-col-wrapper">
            <div
              className="anime-col"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {/* Render the latest episodes */}
              {latestEpisodes.length > 0 ? (
                latestEpisodes
                  .slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)
                  .map((episode) => (
                    <div
                      key={episode.id}
                      className="anime-item"
                      onClick={() => handleEpisodeClick(episode.id)}
                    >
                      <img
                        className="anime-image"
                        src={episode.img}
                        alt={episode.name}
                      />
                      <span className="anime-badge">{episode.duration}</span>
                      <p>{episode.name}</p>
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
            disabled={loading || (currentIndex >= Math.ceil(latestEpisodes.length / itemsPerPage) - 1 && page >= totalPages)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default LatestEpisodes;
