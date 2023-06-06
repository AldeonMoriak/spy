import { useEffect, useState } from "react";

export default function useTimer(time: string) {
  const [timer, setTimer] = useState(parseFloat(time) * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [hasStarted, setHasStarted] = useState(false);
  useEffect(() => {
    let interval: NodeJS.Timer;
    if (hasStarted) {
      interval = setInterval(() => {
        const value = (Date.now() - startDate) / 1000;
        setElapsedTime((prev) => {
          return value;
        });
      }, 100);
      if (timer - elapsedTime < 0) {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [hasStarted, startDate]);
  const startTimer = () => {
    setHasStarted(true);
    setStartDate(Date.now());
  };
  const getTime = () => {
    const currentSeconds = timer - Math.floor(elapsedTime);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    return `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
  };
  return { timer, getTime, startTimer, elapsedTime };
}
