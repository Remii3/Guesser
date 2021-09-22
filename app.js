const express = require("express");
const app = express();
const path = require("path");
const gameRoutes = require("./routes/game");

app.listen("https://remii3.github.io/Guesser/");

app.use(express.static(path.join(__dirname, "public")));

gameRoutes(app);
