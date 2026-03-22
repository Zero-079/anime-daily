import React from "react";

const SkeletonLoader: React.FC = () => {
  const skeletonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "var(--radius-md)",
  };

  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    background: "var(--color-bg-card)",
    backdropFilter: "blur(20px)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "var(--shadow-card)",
    maxWidth: "450px",
    margin: "0 auto",
    width: "100%",
  };

  const imageContainerStyle: React.CSSProperties = {
    width: "280px",
    height: "400px",
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    marginBottom: "24px",
    ...skeletonStyle,
  };

  const titleStyle: React.CSSProperties = {
    width: "200px",
    height: "28px",
    marginBottom: "8px",
    ...skeletonStyle,
  };

  const titleJpStyle: React.CSSProperties = {
    width: "160px",
    height: "20px",
    marginBottom: "16px",
    opacity: 0.6,
    ...skeletonStyle,
  };

  const scoreContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  };

  const scoreStyle: React.CSSProperties = {
    width: "60px",
    height: "32px",
    borderRadius: "8px",
    ...skeletonStyle,
  };

  const rankStyle: React.CSSProperties = {
    width: "50px",
    height: "24px",
    borderRadius: "12px",
    ...skeletonStyle,
  };

  const badgesContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "16px",
  };

  const badgeStyle: React.CSSProperties = {
    width: "70px",
    height: "28px",
    borderRadius: "20px",
    ...skeletonStyle,
  };

  const synopsisStyle: React.CSSProperties = {
    width: "100%",
    height: "80px",
    marginBottom: "16px",
    ...skeletonStyle,
  };

  const detailsStyle: React.CSSProperties = {
    width: "180px",
    height: "20px",
    ...skeletonStyle,
  };

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle} />
      <div style={titleStyle} />
      <div style={titleJpStyle} />
      <div style={scoreContainerStyle}>
        <div style={scoreStyle} />
        <div style={rankStyle} />
      </div>
      <div style={badgesContainerStyle}>
        <div style={badgeStyle} />
        <div style={badgeStyle} />
        <div style={badgeStyle} />
      </div>
      <div style={synopsisStyle} />
      <div style={detailsStyle} />
    </div>
  );
};

export default SkeletonLoader;
