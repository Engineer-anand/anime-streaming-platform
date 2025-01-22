import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../style/global.css';
import AnimeSearch from './AnimeSearch';
// import Footer from '../components/Footer';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animeResults, setAnimeResults] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api-hazel-pi.vercel.app/aniwatch/search?keyword=${searchTerm}`
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
  //   document.addEventListener('contextmenu', (e) => e.preventDefault());

  // // Disable specific keyboard shortcuts
  // document.addEventListener('keydown', (e) => {
  //   if (
  //     (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I (DevTools)
  //     (e.ctrlKey && e.key === 'U') || // Ctrl+U (View Source)
  //     (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C (Inspect)
  //     (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J (Console)
  //     (e.key === 'F12') // F12 (DevTools)
  //   ) {
  //     e.preventDefault();
  //   }
  // });

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

  const handleAnimeClick = (id) => {
    navigate(`/anime/${id}`);
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
    <div className="wrap">


      <div className="home-container">
        <AnimeSearch
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
        />

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {!loading && animeResults.length === 0 && !error && (
          <div className="placeholder">
            <h2>NexAnime.site - The best site to watch anime online for Free 🎬</h2>
            <p>

              Just like free online movie streaming sites, anime watching sites are not created equally, some are better than the rest, so we've decided to build NexAnime.site to be one of the best free anime streaming site for all anime fans on the world.</p>
            <h2>1/ What is NexAnime.site?</h2>
            <p>NexAnime.site is a free site to watch anime and you can even download subbed or dubbed anime in ultra HD quality without any registration or payment. By having only one ads in all kinds, we are trying to make it the safest site for free anime.</p>
            {/* <h2>2/ Is NexAnime.sitesafe?</h2>
            <p>Yes we are, we do have only one Ads to cover the server cost and we keep scanning the ads 24/7 to make sure all are clean, If you find any ads that is suspicious, please forward us the info and we will remove it.</p> */}
            <h2>2/ So what make NexAnime.site the best site to watch anime free online?</h2>
            <p>
              Before building NexAnime.site, we've checked many other free anime sites, and learnt from them. We only keep the good things and remove all the bad things from all the competitors, to put it in our NexAnime website. Let's see how we're so confident about being the best site for anime streaming:
              <br />
              <br />
              <ul>

                <li>&#8226;Content library: Our main focus is anime. You can find here popular, classic, as well as current titles from all genres such as action, drama, kids, fantasy, horror, mystery, police, romance, school, comedy, music, game and many more. All these titles come with English subtitles or are dubbed in many languages.</li><br />
                <li>&#8226;Quality/Resolution: All titles are in excellent resolution, the best quality possible. NexAnime.site also has a quality setting function to make sure our users can enjoy streaming no matter how fast your Internet speed is. You can stream the anime at 360p if your Internet is being ridiculous, Or if it is good, you can go with 720p or even 1080p anime.</li><br />
                <li>&#8226;Streaming experience: Compared to other anime streaming sites, the loading speed at NexAnime.site is faster. Downloading is just as easy as streaming, you won't have any problem saving the videos to watch offline later.</li>
                <li>&#8226;Updates: We updates new titles as well as fulfill the requests on a daily basis so be warned, you will never run out of what to watch on NexAnime.</li><br />
                <li>&#8226;User interface: Our UI and UX makes it easy for anyone, no matter how old you are, how long have you been on the Internet. Literally, you can figure out how to navigate our site after a quick look. If you want to watch a specific title, search for it via the search box. If you want to look for suggestions, you can use the site's categories or simply scroll down for new releases.</li><br />
                <li>&#8226;Device compatibility: NexAnime works alright on both your mobile and desktop. However, we'd recommend you use your desktop for a smoother streaming experience.</li>
              </ul>
              <br />
              So if you're looking for a trustworthy and safe site for your Anime streaming, let's give NexAnime.site a try. And if you like us, please help us to spread the words and do not forget to bookmark our site.
              <br />
              <br />
              <br />
              Thank you!
            </p>
            <br />
            <br />

            <footer>
              <p>&copy; 2025 NexAnime All rights reserved.</p>
            </footer>
          </div>
        )}

        {overlayVisible && (
          <div className="overlay">
            <div className="anime-grid-overlay">
              {animeResults.map((anime, index) => (
                <div
                  key={index}
                  className="anime-card"
                  onClick={() => handleAnimeClick(anime.id)}
                >
                  <img src={anime.img} alt={anime.name} className="anime-image" />
                  <h3>{anime.name}</h3>
                  <p>Duration: {anime.duration}</p>
                  <p>Episodes: {anime.episodes.eps}</p>
                  <p>Subtitles: {anime.episodes.sub}</p>
                  <p>Dub: {anime.episodes.dub ? anime.episodes.dub : 'N/A'}</p>
                </div>
              ))}
              {/* <Footer /> */}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
