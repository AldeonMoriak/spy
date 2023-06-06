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
    // const minutes = Math.floor(timer / 60);
    // const seconds = timer % 60;
    const tt = timer - Math.floor(elapsedTime);
    const minutes = Math.floor(tt / 60);
    const seconds = tt % 60;
    return (
      <div className="text-6xl">
        {minutes}:{seconds > 9 ? seconds : `0${seconds}`}
      </div>
    );
  };
  return { timer, getTime, startTimer, elapsedTime };
}
