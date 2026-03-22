export const mockAnime = {
  mal_id: 1,
  title: "Cowboy Bebop",
  title_english: "Cowboy Bebop",
  title_japanese: "カウボーイビバップ",
  images: {
    jpg: {
      image_url: "https://example.com/image.jpg",
      large_image_url: "https://example.com/large.jpg"
    }
  },
  score: 8.75,
  rank: 35,
  genres: [{ name: "Action" }, { name: "Sci-Fi" }],
  themes: [{ name: "Space" }],
  synopsis: "A great anime about space cowboys...",
  episodes: 26,
  status: "Finished Airing",
  studios: [{ name: "Sunrise" }],
  year: 1998,
  url: "https://myanimelist.net/anime/1/Cowboy_Bebop"
};

export const mockAnimeMinimal = {
  mal_id: 2,
  title: "Test Anime",
  title_english: null,
  title_japanese: null,
  images: {
    jpg: {
      image_url: "",
      large_image_url: ""
    }
  },
  score: null,
  rank: null,
  genres: [],
  themes: [],
  synopsis: null,
  episodes: null,
  status: "Airing",
  studios: [],
  year: null,
  url: "https://myanimelist.net/anime/2"
};
