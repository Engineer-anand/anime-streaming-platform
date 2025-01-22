import React from 'react';
import './../style/animeSearch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logo from './../image/nex.png'

function AnimeSearch({ searchTerm, handleSearchChange, handleSearchSubmit }) {

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(); // Trigger search when Enter key is pressed
        }
    };

    const popularAnime = [
        { name: "Solo Leveling Season 2", id: "solo-leveling-season-2-arise-from-the-shadow-19413" },
        { name: "Sakamoto Days", id: "sakamoto-days-19431" },
        { name: "One Piece", id: "one-piece-100" },
        { name: "The Apothecary Diaries Season 2", id: "the-apothecary-diaries-18578" },
        { name: "Shangri-La Frontier", id: "shangri-la-frontier-18567" },
        { name: "Blue Lock season 2", id: "blue-lock-season-2-19318" },
        { name: "Frieren: Beyond Journey's End", id: "frieren-beyond-journeys-end-18542" },
        { name: "Shangri-La Frontier Season 2", id: "shangri-la-frontier-season-2-19324" },
        { name: "I'm Getting Married to a Girl I Hate in My Class", id: "im-getting-married-to-a-girl-i-hate-in-my-class-19439" }
    ];

    return (
        <div className="container">
            <div className="search-box">
                <div className="contents">
                    <h1 className="titles">
                        {/* h<span className="highlights">!</span>Toon */}
                        <img src={logo}alt="" />
                    </h1>
                    <div className="search-bar">
                        <input
                            className="search-input"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress} // Add key press event
                            placeholder="Search anime..."
                        />
                        <button className="search-buttons" onClick={handleSearchSubmit}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                    <div className="p">


                        {popularAnime.map((anime) => (
                            <span key={anime.id}>
                                <Link to={`/anime/${anime.id}`} className="anime-link">
                                    {anime.name}
                                </Link>
                            </span>
                        ))}

                    </div>
                    <div className="btn">
                        <Link to="/home">
                            <button>
                                Watch Anime
                                <FontAwesomeIcon className='i' icon={faCircleArrowRight} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeSearch;


