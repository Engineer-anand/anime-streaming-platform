import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Hls from "hls.js";
import { API_BASE_URL } from "../config/apiConfig";
import './../style/global.css';

const VideoPlayer = ({ episodeId, animeName, onNavigateEpisode }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("sub"); // Default to "sub"
  const [isSubAvailable, setIsSubAvailable] = useState(true);
  const [isDubAvailable, setIsDubAvailable] = useState(true);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Check availability for subtitles and dubbed version
  useEffect(() => {
    const fetchCategoryAvailability = async () => {
      if (!episodeId) return;

      try {
        const resSub = await axios.get(
          `${API_BASE_URL}/aniwatch/episode-srcs?id=${episodeId}&server=vidstreaming&category=sub`
        );
        const resDub = await axios.get(
          `${API_BASE_URL}/aniwatch/episode-srcs?id=${episodeId}&server=vidstreaming&category=dub`
        );

        setIsSubAvailable(resSub.data?.sources?.length > 0);
        setIsDubAvailable(resDub.data?.sources?.length > 0);
      } catch (error) {
        console.error("Error checking category availability:", error);
      }
    };

    fetchCategoryAvailability();
  }, [episodeId]);

  // Fetch video and subtitles based on category
  useEffect(() => {
    const fetchData = async () => {
      if (!episodeId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/aniwatch/episode-srcs?id=${episodeId}&server=vidstreaming&category=${category}`
        );

        if (res.data) {
            // console.log(re)
          const { sources, subtitles: subs } = res.data;
          if (sources && sources.length > 0) {
            setVideoUrl(sources[0].url);
          }
          if (subs) {
            setSubtitles(subs);
          } else {
            setSubtitles([]);
          }
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [episodeId, category]); // Re-fetch data when the category changes

  // Initialize HLS.js for streaming the video
  useEffect(() => {
    if (videoUrl && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map((level) => ({
          label: `${level.height}p`,
          bitrate: level.bitrate,
        }));

        setQualityLevels(levels);
        const defaultQuality = levels.find((level) => level.label === "720p") || levels[0];
        setSelectedQuality(defaultQuality);

        const selectedIndex = levels.indexOf(defaultQuality);
        hls.startLevel = selectedIndex;
        hls.loadLevel = selectedIndex;
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
      };
    }
  }, [videoUrl]);

  // Handle quality change
  const handleQualityChange = (e) => {
    const selectedLevel = qualityLevels.find(
      (level) => level.label === e.target.value
    );
    setSelectedQuality(selectedLevel);

    const selectedIndex = qualityLevels.indexOf(selectedLevel);
    if (hlsRef.current) {
      hlsRef.current.startLevel = selectedIndex;
      hlsRef.current.loadLevel = selectedIndex;
    }
  };

  // Handle subtitle change
  const handleSubtitleChange = (e) => {
    const trackSrc = e.target.value;
    const video = videoRef.current;

    const existingTracks = Array.from(video.textTracks);
    existingTracks.forEach((track) => (track.mode = "disabled"));

    if (trackSrc !== "none") {
      const track = existingTracks.find((t) => t.src === trackSrc);
      if (track) {
        track.mode = "showing";
      }
    }
  };

  // Switch between sub and dub categories
  const handleCategoryChange = (newCategory) => {
    if (newCategory !== category) {
      setCategory(newCategory);
      setVideoUrl(null); // Reset video URL to force reloading
      setSubtitles([]); // Reset subtitles
    }
  };

  return (
    <div className={`video-container ${loading ? "loading" : ""}`}>
      <div className="category-switcher">
        <button
          className={`category-button ${category === "sub" ? "active" : ""}`}
          onClick={() => handleCategoryChange("sub")}
          disabled={!isSubAvailable}
        >
          Sub
        </button>
        <button
          className={`category-button ${category === "dub" ? "active" : ""}`}
          onClick={() => handleCategoryChange("dub")}
          disabled={!isDubAvailable}
        >
          Dub
        </button>
      </div>

      <video
        ref={videoRef}
        controls
        autoPlay
        className="video-player"
      >
        {videoUrl && !Hls.isSupported() ? (
          <source src={videoUrl} type="video/mp4" />
        ) : (
          <p>Your browser does not support the video stream.</p>
        )}
        {subtitles.map((sub, index) => (
          <track
            key={index}
            src={sub.url}
            kind="subtitles"
            label={sub.lang}
            srcLang={sub.lang}
            default={index === 0}
          />
        ))}
      </video>

      {qualityLevels.length > 0 && (
        <div className="video-quality-dropdown">
          <label htmlFor="quality-select">Quality:</label>
          <select
            id="quality-select"
            value={selectedQuality?.label}
            onChange={handleQualityChange}
          >
            {qualityLevels.map((quality, index) => (
              <option key={index} value={quality.label}>
                {quality.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {subtitles.length > 0 && (
        <div className="video-subtitles-dropdown">
          <label htmlFor="subtitle-select">Subtitles:</label>
          <select id="subtitle-select" onChange={handleSubtitleChange}>
            <option value="none">None</option>
            {subtitles.map((sub, index) => (
              <option key={index} value={sub.url}>
                {sub.lang}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="episode-navigation">
        <button onClick={() => onNavigateEpisode(-1)}>Previous Episode</button>
        <button onClick={() => onNavigateEpisode(1)}>Next Episode</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
