import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './../../style/RecommendedAnime.css'; // Import the external CSS file

const RecommendedAnime = () => {
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if data exists in localStorage
    const storedData = localStorage.getItem('animeData');
    if (storedData) {
      setAnimeData(JSON.parse(storedData));
      setLoading(false);
    } else {
      // Fetch the recommended anime data from the API
      fetch('https://api-3-git-main-anands-projects-36cf6daf.vercel.app/api/random')
        .then((response) => response.json())
        .then((data) => {
          console.log('API Response:', data);
          if (data && data.results.recommended_data) {
            const recommendedData = data.results.recommended_data;
            setAnimeData(recommendedData);
            localStorage.setItem('animeData', JSON.stringify(recommendedData)); // Store data in localStorage
            setLoading(false);
          } else {
            console.error('API response does not contain recommended_data:', data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching anime data:', error);
          setLoading(false);
        });
    }
  }, []);

  const handleAnimeClick = (id) => {
    navigate(`/anime/${id}`); // Navigate to the anime detail page
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!animeData || animeData.length === 0) {
    return <div className="no-data">No recommended anime found.</div>;
  }

  return (
    <div className="contain">
      <h1 className="title">Recommended Anime</h1>
      <div className="anime-list">
        {animeData.map((anime, index) => (
          <div
            key={index}
            className="anime-card"
            onClick={() => handleAnimeClick(anime.id)} // Use data_id for navigation
          >
            <img src={anime.poster} alt={anime.title} className="poster" />
            <div className="anime-info">
              <h2 className="anime-title">{anime.title}</h2>
              <p>
                <strong>Type:</strong> {anime.tvInfo.showType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedAnime;
