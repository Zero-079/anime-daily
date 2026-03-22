import React from "react";

interface GenreBadgeProps {
  name: string;
  index?: number;
}

const GenreBadge: React.FC<GenreBadgeProps> = ({ name, index = 0 }) => {
  return (
    <span
      className="genre-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        margin: "4px",
        fontSize: "0.8rem",
        fontWeight: 500,
        color: "var(--color-accent)",
        background: "rgba(0, 212, 255, 0.1)",
        border: "1px solid rgba(0, 212, 255, 0.3)",
        borderRadius: "20px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        animation: "fadeIn 0.4s ease forwards",
        animationDelay: `${0.3 + index * 0.05}s`,
        opacity: 0,
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0, 212, 255, 0.2)";
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 212, 255, 0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(0, 212, 255, 0.1)";
        e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.3)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {name}
    </span>
  );
};

export default GenreBadge;
