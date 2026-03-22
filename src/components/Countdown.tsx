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

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "2px",
  };

  const digitsContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const digitBoxStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  };

  const digitStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "52px",
    height: "64px",
    background: "linear-gradient(180deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)",
    border: "1px solid rgba(0, 212, 255, 0.3)",
    borderRadius: "8px",
    fontSize: "2rem",
    fontWeight: 700,
    fontFamily: "'Outfit', monospace",
    color: "var(--color-accent)",
    boxShadow: "0 4px 20px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
    textShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
  };

  const unitStyle: React.CSSProperties = {
    fontSize: "0.65rem",
    fontWeight: 500,
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const separatorStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--color-accent)",
    opacity: 0.6,
    marginTop: "-20px",
    animation: "pulse 1s ease-in-out infinite",
  };

  const renderDigitBox = (value: string, unit: string) => (
    <div style={digitBoxStyle}>
      <div style={digitStyle}>{value}</div>
      <span style={unitStyle}>{unit}</span>
    </div>
  );

  return (
    <div style={containerStyle} className="animate-slide-down">
      <span style={labelStyle}>Next Recommendation In</span>
      <div style={digitsContainerStyle}>
        {renderDigitBox(padZero(time.hours), "Hours")}
        <span style={separatorStyle}>:</span>
        {renderDigitBox(padZero(time.minutes), "Minutes")}
        <span style={separatorStyle}>:</span>
        {renderDigitBox(padZero(time.seconds), "Seconds")}
      </div>
    </div>
  );
};

export default Countdown;
