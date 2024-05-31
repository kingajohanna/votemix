import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface TimeLeft {
  nap?: number;
  óra?: number;
  perc?: number;
  mp?: number;
}

const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = new Date("June 9, 2024 19:00:00");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        nap: Math.floor(difference / (1000 * 60 * 60 * 24)),
        óra: Math.floor((difference / (1000 * 60 * 60)) % 24),
        perc: Math.floor((difference / 1000 / 60) % 60),
        mp: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval as keyof TimeLeft] !== undefined) {
      timerComponents.push(
        <span style={{ fontSize: "16px" }} key={interval}>
          {timeLeft[interval as keyof TimeLeft]} {interval}{" "}
        </span>
      );
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        A választásokig hátralévő idő:
      </Typography>
      <Box>
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </Box>
    </Box>
  );
};

export default Countdown;
