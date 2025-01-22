import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './../style/AnimeDetails.css';
import Header from '../components/Header';

const AnimeDetails = () => {
  const { id } = useParams(); // Get the anime ID from the URL
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the page is loaded
  }, [id]);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const cachedData = localStorage.getItem(`animeDetails-${id}`);

        if (cachedData) {
          setAnimeDetails(JSON.parse(cachedData));
          setLoading(false);
        } else {
          const response = await fetch(`https://api-hazel-pi.vercel.app/aniwatch/anime/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();

          if (data && data.info) {
            setAnimeDetails(data);
            localStorage.setItem(`animeDetails-${id}`, JSON.stringify(data));
          } else {
            throw new Error('Invalid data returned from API.');
          }
        }
      } catch (err) {
        console.error('Error Fetching Anime Details:', err);
        setError('Failed to fetch anime details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const safelyJoin = (array) => (Array.isArray(array) ? array.join(', ') : array || 'N/A');

  const handleWatchClick = () => {
    navigate(`/episodes/${id}`, { 
      state: { 
        animeName: animeDetails.info.name, 
        seasons: animeDetails.seasons, 
        relatedAnimes: animeDetails.relatedAnimes,
        recommendedAnimes: animeDetails.recommendedAnimes
      }
    });
  };

  const handleCardClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;
  if (!animeDetails) return <p>No details available.</p>;

  const { info, moreInfo, seasons, relatedAnimes, recommendedAnimes, mostPopularAnimes } = animeDetails;

  return (
    <div className="anime-details">
      <Header/>
      <div className="main-cont">
        <div className="img">
          <img src={info.img} alt={info.name} />
        </div>

        <div className="cont">
          <span>{info.name}</span>
          <p>{info.description}</p>
          <h3>Episodes</h3>
          <p>Episodes: {info.episodes?.eps || 'N/A'}</p>
          <p>Sub: {info.episodes?.sub || 'N/A'}</p>
          <p>Dub: {info.episodes?.dub || 'N/A'}</p>
          <h3>Rating</h3>
          <p>{info.rating || 'No rating available'}</p>
        </div>
      </div>

      <div className="watch-btn">
        <button onClick={handleWatchClick}>▶ Watch Now</button>
      </div>

      <h3>More Information</h3>
      <ul>
        <li><strong>Japanese:</strong> {moreInfo['Japanese:'] || 'N/A'}</li>
        <li><strong>Synonyms:</strong> {moreInfo['Synonyms:'] || 'N/A'}</li>
        <li><strong>Aired:</strong> {moreInfo['Aired:'] || 'N/A'}</li>
        <li><strong>Premiered:</strong> {moreInfo['Premiered:'] || 'N/A'}</li>
        <li><strong>Duration:</strong> {moreInfo['Duration:'] || 'N/A'}</li>
        <li><strong>Status:</strong> {moreInfo['Status:'] || 'N/A'}</li>
        <li><strong>MAL Score:</strong> {moreInfo['MAL Score:'] || 'N/A'}</li>
        <li><strong>Studios:</strong> {safelyJoin(moreInfo['Studios:'])}</li>
        <li><strong>Genres:</strong> {safelyJoin(moreInfo['Genres'])}</li>
        <li><strong>Producers:</strong> {safelyJoin(moreInfo['Producers'])}</li>
      </ul>

      <h3>Seasons</h3>
      <div className="seasons">
        {seasons && seasons.length > 0 ? (
          seasons.map((season) => (
            <div key={season.id} className="season" onClick={() => handleCardClick(season.id)}>
              <img src={season.img} alt={season.seasonTitle} />
              <h4>{season.seasonTitle}</h4>
              {season.isCurrent && <span>(Current)</span>}
            </div>
          ))
        ) : (
          <p>No seasons available.</p>
        )}
      </div>

      <h3>Related Animes</h3>
      <div className="related-animes">
        {relatedAnimes && relatedAnimes.length > 0 ? (
          relatedAnimes.map((anime) => (
            <div key={anime.id} className="related-anime" onClick={() => handleCardClick(anime.id)}>
              <img src={anime.img} alt={anime.name} />
              <h4>{anime.name}</h4>
              <p>{anime.category}</p>
            </div>
          ))
        ) : (
          <p>No related animes available.</p>
        )}
      </div>

      <h3>Recommended Animes</h3>
      <div className="recommended-animes">
        {recommendedAnimes && recommendedAnimes.length > 0 ? (
          recommendedAnimes.map((anime) => (
            <div key={anime.id} className="recommended-anime" onClick={() => handleCardClick(anime.id)}>
              <img src={anime.img} alt={anime.name} />
              <h4>{anime.name}</h4>
              <p>Episodes: {anime.episodes?.eps || 'N/A'}</p>
              <p>Duration: {anime.duration || 'N/A'}</p>
              <p>Rated: {anime.rated ? 'Yes' : 'No'}</p>
            </div>
          ))
        ) : (
          <p>No recommended animes available.</p>
        )}
      </div>

      <h3>Most Popular Animes</h3>
      <div className="most-popular-animes">
        {mostPopularAnimes && mostPopularAnimes.length > 0 ? (
          mostPopularAnimes.map((anime) => (
            <div key={anime.id} className="popular-anime" onClick={() => handleCardClick(anime.id)}>
              <img src={anime.img} alt={anime.name} />
              <h4>{anime.name}</h4>
              <p>{anime.category}</p>
              <p>Episodes: {anime.episodes?.eps || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No popular animes available.</p>
        )}
      </div>
    </div>
  );
};

export default AnimeDetails;
