import React, { useEffect, useRef, useState } from 'react';
import '../styles/GeneratedMusicPlayer.css';

const melody = [
  392, 440, 494, 587, 494, 440, 392, 330,
  349, 392, 440, 523, 440, 392, 349, 294
];

function GeneratedMusicPlayer({ enabled = true }) {
  const [playing, setPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const noteIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled && playing) {
      stopMusic();
    }

    return () => stopMusic();
  }, [enabled]);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  };

  const playNote = () => {
    const context = getAudioContext();
    const frequency = melody[noteIndexRef.current % melody.length];
    const now = context.currentTime;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.45);
    noteIndexRef.current += 1;
  };

  const startMusic = async () => {
    if (!enabled || playing) {
      return;
    }

    const context = getAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
    }

    playNote();
    timerRef.current = window.setInterval(playNote, 520);
    setPlaying(true);
  };

  const stopMusic = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setPlaying(false);
  };

  const handleToggle = () => {
    if (playing) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <button
      type="button"
      className={`music-toggle ${playing ? 'is-playing' : ''}`}
      onClick={handleToggle}
      title={playing ? 'Stop generated music' : 'Play generated music'}
      aria-label={playing ? 'Stop generated music' : 'Play generated music'}
    >
      {playing ? 'Music On' : 'Music'}
    </button>
  );
}

export default GeneratedMusicPlayer;
