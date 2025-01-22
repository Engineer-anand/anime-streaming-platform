import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../style/global.css"; // Import the CSS file

const Sidebar = () => {
    const [topAnimes, setTopAnimes] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState("day"); // Default to 'day'
    const navigate = useNavigate(); // To navigate programmatically

    // Fetch data from API or get it from localStorage
    const fetchTopAnimes = async (period) => {
        try {
            // Check if data exists in localStorage for the selected period
            const cachedData = localStorage.getItem(`topAnimes-${period}`);
            if (cachedData) {
                // Use cached data if available
                setTopAnimes(JSON.parse(cachedData));
            } else {
                // Fetch data from the API if no cached data
                const response = await fetch("https://api-hazel-pi.vercel.app/aniwatch");
                const data = await response.json();
                const topAnimesForPeriod = data.top10Animes[period];

                // Save the data in localStorage for future use
                localStorage.setItem(`topAnimes-${period}`, JSON.stringify(topAnimesForPeriod));

                // Set the fetched data
                setTopAnimes(topAnimesForPeriod);
            }
        } catch (error) {
            console.error("Error fetching the data: ", error);
        }
    };

    // Effect to fetch data based on selected period
    useEffect(() => {
        fetchTopAnimes(selectedPeriod);
    }, [selectedPeriod]);

    // Render the top 10 anime list
    const renderTopAnimes = () => {
        return topAnimes.map((anime) => (
            <div
                key={anime.id}
                className="top10-item"
                onClick={() => navigate(`/anime/${anime.id}`)} // Navigate to anime details page
            >
                <span className="rank">{anime.rank}.</span>
                <div>
                    <img alt={`Cover image of ${anime.name}`} className="cover-image" src={anime.img} />
                </div>
                <div className="item-details">
                    <h2 className="item-title">{anime.name}</h2>
                    <div className="item-info">
                        <span className="info-tag cc">Episodes: {anime.episodes.eps}</span>
                        <span className="info-tag">CC {anime.episodes.sub}</span>
                        <span className="info-tag">🎙️{anime.episodes.dub}</span>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="sidebar-container">
            <h1 className="top10-title">Top 10</h1>
            <div className="top10-buttons">
                <button
                    className={`button ${selectedPeriod === "day" ? "active" : ""}`}
                    onClick={() => setSelectedPeriod("day")}
                >
                    Today
                </button>
                <button
                    className={`button ${selectedPeriod === "week" ? "active" : ""}`}
                    onClick={() => setSelectedPeriod("week")}
                >
                    Week
                </button>
                <button
                    className={`button ${selectedPeriod === "month" ? "active" : ""}`}
                    onClick={() => setSelectedPeriod("month")}
                >
                    Month
                </button>
            </div>
            <div className="top10-list">{renderTopAnimes()}</div>
        </div>
    );
};

export default Sidebar;
