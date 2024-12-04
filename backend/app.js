const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(
  cors({
    origin: [
      "https://jobscrapper-frontend.onrender.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const scrapeRouter = require("./routes/scrapeRoutes");

app.use("/api/v1", scrapeRouter);

module.exports = app;
