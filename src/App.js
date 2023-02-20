import React, { useState, useRef } from 'react';
import './AudioPlayer.css';
import audio1 from './components/audio1.ogg';
import audio2 from './components/audio2.ogg';
import audio3 from './components/audio3.ogg';

const songs = [  { name: 'audio1', src: `${audio1}` },  { name: 'audio2', src: `${audio2}` },  { name: 'audio3', src: `${audio3}` },];

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const audioRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handlePlaybackRateChange = (e) => {
    const newPlaybackRate = parseFloat(e.target.value);
    setPlaybackRate(newPlaybackRate);
    audioRef.current.playbackRate = newPlaybackRate;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleAudioChange = (newSrc) => {
    if (isPlaying) {
      audioRef.current.pause();
    }
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);

    const newSong = songs.find((song) => song.src === newSrc);
    setCurrentSong(newSong);
    audioRef.current.src = newSrc;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="audio-player">
       <audio
        src={currentSong.src}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onVolumeChange={handleVolumeChange}
        onEnded={handleEnded}
      />
      <div className="audio-controls">
  <button className="play-pause-button" onClick={togglePlay}>
    {isPlaying ? 'Pause' : 'Play'}
  </button>
  <div className="song-buttons">
    {songs.map((song) => (
      <button
        key={song.src}
        className={`song-button ${song.src === currentSong.src ? 'active' : ''}`}
        onClick={() => handleAudioChange(song.src)}
      >
        {song.name}
      </button>
    ))}
  </div>
  <div className="time-controls">
    <span className="current-time">{formatTime(currentTime)}</span>
    <input
      type="range"
      min="0"
      max={duration}
      value={currentTime}
      onChange={handleSeek}
    />
    <span className="duration">{formatTime(duration)}</span>
  </div>
  <div className="volume-controls">
    <label htmlFor="playback-volume-slider">Volume:</label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.001"
      value={volume}
      onChange={handleVolumeChange}
    />
  </div>
  <div className="playback-rate-controls">
    <label htmlFor="playback-rate-slider">Speed:</label>
    <input
      id="playback-rate-slider"
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      value={playbackRate}
      onChange={handlePlaybackRateChange}
    />
    <span>{playbackRate.toFixed(1)}x</span>
  </div>
  <a
    href={currentSong.src}
    download={`${currentSong.name}.ogg`}
    className="download-button"
  >
    Download
  </a>
</div>
    </div>
  );
};

export default AudioPlayer;
