import React from 'react';
import './../style/global.css';

const DetailHoverCard = ({ anime }) => {
  if (!anime) return null; // Return nothing if no anime is hovered

  return (
    <div className="anime-detail-popup">
      <h4>{anime.name}</h4>
      <p>Duration: {anime.duration}</p>
      <p>Episodes: {anime.episodes.eps}</p>
      <p>Subtitles: {anime.episodes.sub}</p>
      <p>Dub: {anime.episodes.dub ? anime.episodes.dub : 'N/A'}</p>
    </div>
  );
};

export default DetailHoverCard;
