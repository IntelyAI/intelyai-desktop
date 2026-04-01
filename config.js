const isDev = process.env.NODE_ENV === "development";

module.exports = {
  APP_URL: isDev ? "http://localhost:3000" : "https://app.intelyai.com",
  APP_NAME: "IntelyAI",
  WINDOW_WIDTH: 1280,
  WINDOW_HEIGHT: 800,
  MIN_WIDTH: 900,
  MIN_HEIGHT: 600,
};
