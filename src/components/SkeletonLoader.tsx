import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-line title"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-meta">
        <div className="skeleton-meta-item"></div>
        <div className="skeleton-meta-item"></div>
        <div className="skeleton-meta-item"></div>
        <div className="skeleton-meta-item"></div>
      </div>
      <div className="skeleton-genres">
        <div className="skeleton-genre"></div>
        <div className="skeleton-genre"></div>
        <div className="skeleton-genre"></div>
      </div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );
};

export default SkeletonLoader;
