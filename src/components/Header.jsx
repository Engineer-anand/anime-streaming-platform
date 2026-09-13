import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import logo from './../image/nex.png';
import './../style/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [animeResults, setAnimeResults] = useState([]);
    const [overlayVisible, setOverlayVisible] = useState(false);
      const [navbarOpen, setNavbarOpen] = useState(false);
    

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = async () => {
        if (!searchTerm.trim()) return; // Prevent empty searches
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/aniwatch/search?keyword=${searchTerm}`);
            setAnimeResults(response.data.animes || []);
            setOverlayVisible(true); // Show overlay on successful search
        } catch (err) {
            console.error("Error fetching anime search results:", err);
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

    const closeOverlay = () => {
        setOverlayVisible(false);
    };

    const handleOverlayClick = (event) => {
        if (event.target.classList.contains('overlay')) {
            closeOverlay();
        }
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
    const handleAnimeClick = (id) => {
        closeOverlay(); // Close the overlay
        navigate(`/anime/${id}`); // Navigate to anime/:id
    };

    return (
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



            {/* Overlay for search results */}
            {overlayVisible && (
                <div className="overlay" onClick={handleOverlayClick}>
                    <div className="overlay-content">
                        <button className="close-overlay" onClick={closeOverlay}>
                            &times;
                        </button>
                        <div className="anime-grid">
                            {animeResults.length > 0 ? (
                                animeResults.map((anime, index) => (
                                    <div
                                        key={index}
                                        className="anime-card"
                                        onClick={() => handleAnimeClick(anime.id)} // Close overlay and navigate
                                    >
                                        <img src={anime.img} alt={anime.name} className="anime-image" />
                                        <h3>{anime.name}</h3>
                                        <p>Duration: {anime.duration}</p>
                                        <p>Episodes: {anime.episodes.eps}</p>
                                        <p>Subtitles: {anime.episodes.sub}</p>
                                        <p>Dub: {anime.episodes.dub || 'N/A'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No results found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
