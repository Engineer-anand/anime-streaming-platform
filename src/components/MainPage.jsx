import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animeResults, setAnimeResults] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayRef = useRef(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/aniwatch/search?keyword=${searchTerm}`);
      setAnimeResults(response.data.animes || []);
      setOverlayVisible(true); // Show overlay
    } catch (error) {
      console.error("Error fetching anime search results:", error);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleOutsideClick = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setOverlayVisible(false); // Close overlay when clicking outside
    }
  };

  useEffect(() => {
    if (overlayVisible) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [overlayVisible]);

  return (
    <div className="anime-search-container">
      <div className="anime-search-box">
        <input
          className="search-input"
          placeholder="Search anime..."
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        <button
          className="search-button"
          onClick={handleSearchSubmit}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {overlayVisible && (
        <div className="overlay">
          <div className="overlay-content" ref={overlayRef}>
            <button className="close-overlay" onClick={() => setOverlayVisible(false)}>
              &times;
            </button>
            <div className="anime-grid">
              {animeResults.length > 0 ? (
                animeResults.map((anime, index) => (
                  <div key={index} className="anime-card">
                    <img src={anime.img} alt={anime.name} className="anime-image" />
                    <h3>{anime.name}</h3>
                    <p>Duration: {anime.duration}</p>
                    <p>Episodes: {anime.episodes.eps}</p>
                    <p>Subtitles: {anime.episodes.sub}</p>
                    <p>Dub: {anime.episodes.dub ? anime.episodes.dub : 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
