import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../style/gridStyles.css';

function MostPopularAnimes() {
  const [animeList, setAnimeList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeData = async () => {
      // Check localStorage for cached data for the current page
      const cachedData = localStorage.getItem(`mostPopularAnimesPage${page}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setAnimeList((prevList) => [...prevList, ...parsedData.mostPopularAnimes]);
        setTotalPages(parsedData.totalPages || 1);
        return;
      }

      if (loading) return;

      setLoading(true);
      try {
        const response = await fetch(`https://api-hazel-pi.vercel.app/aniwatch/?page=${page}`);
        const data = await response.json();

        if (data.featuredAnimes && data.featuredAnimes.mostPopularAnimes) {
          setAnimeList((prevList) => [
            ...prevList,
            ...data.featuredAnimes.mostPopularAnimes,
          ]);

          // Save the fetched data to localStorage
          localStorage.setItem(
            `mostPopularAnimesPage${page}`,
            JSON.stringify({
              mostPopularAnimes: data.featuredAnimes.mostPopularAnimes,
              totalPages: data.totalPages,
            })
          );
        }

        if (data.totalPages) {
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [page, loading]);

  const handleNext = () => {
    if (currentIndex < Math.ceil(animeList.length / itemsPerPage) - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else if (page < totalPages) {
      setPage(page + 1);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  return (
    <div className="anime-container">
      <h2 className="popular-today">Most Popular Animes</h2>
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
              {animeList.length > 0 ? (
                animeList
                  .slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage)
                  .map((anime, index) => (
                    <div
                      key={index}
                      className="anime-item"
                      onClick={() => handleAnimeClick(anime.id)}
                    >
                      <img className="anime-image" src={anime.img} alt={anime.name} />
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
            disabled={
              loading ||
              (currentIndex >= Math.ceil(animeList.length / itemsPerPage) - 1 &&
                page >= totalPages)
            }
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MostPopularAnimes;
