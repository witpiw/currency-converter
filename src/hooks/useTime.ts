import { useEffect, useState } from "react";

export const useTime = (refreshCycle = 100) => {
  const [now, setNow] = useState(getTime());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(getTime()), refreshCycle);

    return () => clearInterval(intervalId);
  }, [refreshCycle, setInterval, clearInterval, setNow, getTime]);

  return now;
};

const getTime = () => new Date();

// https://gist.github.com/jamesfulford/7f3311bd918982e68d911a9c70b27415
