import React, { useEffect, useRef, useState } from "react";

const App = () => {
  // Time stored in centiseconds (1 cs = 10ms)
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // useRef to store interval id (mutable, no re-render)
  const intervalRef = useRef(null);

  // Start timer
  const startTimer = () => {
    if (intervalRef.current) return; // prevent multiple intervals

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 10);
  };

  // Stop timer
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  // Record lap
  const lapTimer = () => {
    if (isRunning) {
      setLaps(prev => [...prev, time]);
    }
  };

  // Reset timer and laps
  const resetTimer = () => {
    stopTimer();
    setTime(0);
    setLaps([]);
  };

  // Cleanup on unmount (memory leak prevention)
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // Format time (mm:ss:cs)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const centiseconds = time % 100;

    return `${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
  };

  const pad = (num) => num.toString().padStart(2, "0");

  return (
    <div>
      <h1>{formatTime(time)}</h1>

      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={lapTimer}>Lap</button>
      <button onClick={resetTimer}>Reset</button>

      <ul>
        {laps.map((lap, index) => (
          <li key={index}>
            Lap {index + 1}: {formatTime(lap)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
