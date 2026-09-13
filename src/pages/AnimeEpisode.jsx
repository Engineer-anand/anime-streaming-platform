import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';
import './../style/AnimeEpisode.css';
import VideoPlayer from '../components/VideoPlayer';
import AnimecardDetails from '../components/veiwPage/AnimecardDetails';
import Header from '../components/Header';
const AnimeEpisodes = () => {
  const { id } = useParams(); // Get the anime ID from the URL
  const { state } = useLocation(); // Retrieve passed state
  const navigate = useNavigate(); // Initialize useNavigate
  const [episodes, setEpisodes] = useState([]); // All episodes data
  const [displayedEpisodes, setDisplayedEpisodes] = useState([]); // Episodes to display on the page
  const [selectedEpisode, setSelectedEpisode] = useState(null); // State to track the selected episode
  const [page, setPage] = useState(1); // Pagination page tracker
  const [episodesPerPage] = useState(10); // Number of episodes per page
  const [loading, setLoading] = useState(true); // Loading state

  const animeName = state?.animeName || 'Unknown Anime'; // Extract the anime name from the passed state
  const seasons = state?.seasons || []; // Extract the seasons data
  const relatedAnimes = state?.relatedAnimes || []; // Extract the related animes data
  const recommendedAnimes = state?.recommendedAnimes || []; // Extract the recommended animes data

  // Fetch episodes from localStorage or API
  useEffect(() => {
    const fetchEpisodes = async () => {
      // Check if episodes are stored in localStorage
      const storedEpisodes = localStorage.getItem(`episodes-${id}`);
      if (storedEpisodes) {
        const parsedEpisodes = JSON.parse(storedEpisodes);
        setEpisodes(parsedEpisodes);
        setSelectedEpisode(parsedEpisodes[0].episodeId); // Automatically select the first episode
        setLoading(false);
      } else {
        try {
          const response = await fetch(`${API_BASE_URL}/aniwatch/episodes/${id}`);
          const data = await response.json();

          if (data.episodes) {
            setEpisodes(data.episodes); // Store all episodes
            setSelectedEpisode(data.episodes[0].episodeId); // Automatically select the first episode
            localStorage.setItem(`episodes-${id}`, JSON.stringify(data.episodes)); // Store episodes in localStorage
            setLoading(false);
          } else {
            console.error('No episodes found');
          }
        } catch (error) {
          console.error('Failed to fetch episodes:', error);
          setLoading(false); // Ensure loader is hidden in case of error
        }
      }
    };

    fetchEpisodes(); // Fetch episodes when the component mounts
  }, [id]);

  // Pagination
  useEffect(() => {
    const loadEpisodes = () => {
      const startIndex = (page - 1) * episodesPerPage;
      const endIndex = startIndex + episodesPerPage;
      setDisplayedEpisodes(episodes.slice(startIndex, endIndex)); // Show the relevant episodes
    };

    loadEpisodes();
  }, [page, episodes]);

  const handlePlayClick = (episodeId) => {
    setSelectedEpisode(episodeId); // Set the selected episode
  };

  const handleNextPage = () => {
    if (page * episodesPerPage < episodes.length) {
      setPage(page + 1); // Go to the next page if there are more episodes
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); // Go to the previous page if we are not on the first page
    }
  };

  const handleNavigateEpisode = (direction) => {
    const currentIndex = episodes.findIndex(
      (ep) => ep.episodeId === selectedEpisode
    );
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < episodes.length) {
      setSelectedEpisode(episodes[newIndex].episodeId);
    }
  };

  const handleCardClick = (animeId) => {
    navigate(`/anime/${animeId}`); // Redirect to the anime details page
  };

  return (
    <>
    <header>
  < Header/>
    </header>
      {loading ? (
        // Full-page loading spinner
        <div className="full-page-loader">
          <div className="loader">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        </div>
      ) : (
        <div className="episode-container">
          <div className="styling">
            <h1 className="header">{animeName}</h1> {/* Display the anime name */}

            {/* Episode List */}
            <ul className="episode-list">
              {displayedEpisodes.map((episode) => (
                <li
                  key={episode.episodeId}
                  className={`episode-item ${selectedEpisode === episode.episodeId ? 'playing' : ''}`}
                >
                  <div
                    className="episode-content"
                    onClick={() => handlePlayClick(episode.episodeId)}
                  >
                    <span className="episode-number">{episode.episodeNo}</span>
                    <span className="episode-name">{episode.name}</span>
                    <button
                      className="play-button"
                      onClick={() => handlePlayClick(episode.episodeId)}
                    >
                      ▶
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                ❮
              </button>
              <button
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={page * episodesPerPage >= episodes.length}
              >
                ❯
              </button>
            </div>
          </div>

          {/* Display the VideoPlayer component only when an episode is selected */}
          {selectedEpisode && (
            <div className="vid-cont">
              <VideoPlayer
                episodeId={selectedEpisode}
                animeName={animeName}
                onNavigateEpisode={handleNavigateEpisode}
              />
            </div>
          )}
        </div>
      )}

      <div className="anime-detail">
        {/* Display Seasons, Related Animes, and Recommended Animes */}
        <h3>Seasons</h3>
        <div className="seasons">
          {seasons && seasons.length > 0 ? (
            seasons.map((season) => (
              <div key={season.id} className="season">
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
      </div>
    </>
  );
};

export default AnimeEpisodes;
