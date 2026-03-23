import React from "react";

interface GenreBadgeProps {
  name: string;
  index?: number;
}

const GenreBadge: React.FC<GenreBadgeProps> = ({ name, index = 0 }) => {
  return (
    <span
      className="genre-badge"
      style={{ animationDelay: `${0.5 + index * 0.06}s` }}
    >
      {name}
    </span>
  );
};

export default GenreBadge;
