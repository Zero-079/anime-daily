import React, { useState, useEffect } from "react";
import { getTimeUntilMidnight, padZero } from "../utils/dateUtils";

const Countdown: React.FC = () => {
  const [time, setTime] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderDigitBox = (value: string, unit: string) => (
    <div className="countdown-item">
      <div className="countdown-value">{value}</div>
      <span className="countdown-label-unit">{unit}</span>
    </div>
  );

  return (
    <div className="countdown">
      <span className="countdown-label">Next Recommendation In</span>
      <div className="countdown-digits">
        {renderDigitBox(padZero(time.hours), "Hours")}
        <span className="countdown-separator">:</span>
        {renderDigitBox(padZero(time.minutes), "Minutes")}
        <span className="countdown-separator">:</span>
        {renderDigitBox(padZero(time.seconds), "Seconds")}
      </div>
    </div>
  );
};

export default Countdown;
