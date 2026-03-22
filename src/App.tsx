import { useDailyAnime } from "./hooks/useDailyAnime";
import AnimeCard from "./components/AnimeCard";
import Countdown from "./components/Countdown";
import SkeletonLoader from "./components/SkeletonLoader";

function App() {
  const { anime, loading, error, retry, dayOfYear } = useDailyAnime();

  return (
    <div className="app">
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      <header className="header">
        <h1 className="logo">Anime Daily</h1>
        <p className="day-counter">Day {dayOfYear} of the year — Recommendation #{dayOfYear}</p>
      </header>

      <main className="main">
        <Countdown />
        
        {loading && <SkeletonLoader />}
        
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={retry} className="retry-btn">
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && anime && <AnimeCard anime={anime} />}
      </main>

      <footer className="footer">
        <p>Powered by <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer">Jikan API</a></p>
      </footer>
    </div>
  );
}

export default App;
