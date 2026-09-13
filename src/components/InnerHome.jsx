import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import './../style/innerHome.css';
import MostPopularAnimes from './Animegrid/mostPopularAnimes';
import TopArising from './Animegrid/TopUpcomingAnimes';
import Top10Animes from './Animegrid/Top10Animes';
import TrendingAnimes from './Animegrid/TrendingAnimes';
import Sidebar from './sidebar';
import RecommendedAnime from './veiwPage/RecommendedAnime';
import Footer from './Footer';
import logo from './../image/nex.png';

const InnerHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [spotLightAnimes, setSpotLightAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animeResults, setAnimeResults] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const totalSlides = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const cachedData = localStorage.getItem('spotlightAnimes');
    if (cachedData) {
      setSpotLightAnimes(JSON.parse(cachedData));
    } else {
      fetch(`${API_BASE_URL}/aniwatch`)
        .then((response) => response.json())
        .then((data) => {
          setSpotLightAnimes(data.spotLightAnimes);
          localStorage.setItem('spotlightAnimes', JSON.stringify(data.spotLightAnimes));
        })
        .catch((error) => console.error('Error fetching spotlight animes:', error));
    }

    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [totalSlides]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/aniwatch/search?keyword=${searchTerm}`
      );
      setAnimeResults(response.data.animes || []);
      setOverlayVisible(true);
    } catch (error) {
      console.error('Error fetching anime search results:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('overlay')) {
      closeOverlay();
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

  const moveSlide = (direction) => {
    setCurrentSlide((prevSlide) => (prevSlide + direction + totalSlides) % totalSlides);
  };

  const handleAnimeClick = (id) => {
    navigate(`/anime/${id}`);
  };

  const openNav = () => {
    setNavbarOpen(true);
  };

  const closeNav = () => {
    setNavbarOpen(false);
  };

  const navigateTo = (path) => {
    navigate(path); // Use navigate to redirect to different pages
  };

  return (
    <div className="anime-website">
      <header className="header">
        <div className="header-left">
          <button className="menu-button" onClick={openNav}>
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="site-title">
            <img src={logo} alt="Logo" />
          </h1>
        </div>
        <div className="search-container">
          <input
            className="search-input"
            placeholder="Search..."
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearchSubmit}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </header>

      {/* Side Navbar */}
      <div id="mySidenav" className={`sidenav ${navbarOpen ? 'open' : ''}`}>
        <button className="closebtn" onClick={closeNav}>
          &times;
        </button>
        <button onClick={() => navigateTo('/home')}>Home</button> {/* Use navigateTo function */}
        <button onClick={() => navigateTo('/about')}>About</button> {/* Use navigateTo function */}
        <button onClick={() => navigateTo('/services')}>Services</button>
        <button onClick={() => navigateTo('/contact')}>Contact</button>
      </div>

      {/* Main Content Wrapper */}
      <div className={`main-wrapper ${navbarOpen ? 'dimmed' : ''}`}>
        <main className="main-content">
          <div className="slider-container">
            <button className="slider-btn prev-btn" onClick={() => moveSlide(-1)}>
              &#10094;
            </button>
            <div
              className="slider"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              {spotLightAnimes.map((anime, index) => (
                <div
                  key={index}
                  className="slide"
                  onClick={() => handleAnimeClick(anime.id)}
                >
                  <img alt={`Slide ${index}`} className="slide-image" src={anime.img} />
                  <div className="slide-info">
                    <h2>{anime.name}</h2>
                    <p>{anime.description}</p>
                  <button className="watch-button">Watch Now</button>

                  </div>
                  {/* <button className="watch-button">Watch Now</button> */}
                </div>
              ))}
            </div>
            <button className="slider-btn next-btn" onClick={() => moveSlide(1)}>
              &#10095;
            </button>
          </div>

          <div className="content">
            <TrendingAnimes />
            <MostPopularAnimes />
            <TopArising />
            <Top10Animes />
          </div>

          <div className="lower-animes">
            <RecommendedAnime />
            <Sidebar />
          </div>
          <Footer />
        </main>
      </div>

      {overlayVisible && (
        <div className="overlay">
          <div className="anime-grid-overlay">
            {animeResults.map((anime, index) => (
              <div
                key={index}
                className="anime-card"
                onClick={() => handleAnimeClick(anime.id)}
              >
                <img src={anime.img} alt={anime.name} />
                <h3>{anime.name}</h3>
                <p>Duration: {anime.duration}</p>
                <p>Episodes: {anime.episodes.eps}</p>
                <p>Subtitles: {anime.episodes.sub}</p>
                <p>Dub: {anime.episodes.dub || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default InnerHome;
