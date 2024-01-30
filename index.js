const express = require("express"),
  morgan = require("morgan");
const app = express();

app.use(morgan("common"));

//top ten list
let topMovies = [
  {
    title: "Movie 1",
    director: "Director 1",
  },

  {
    title: "Movie 2",
    director: "Director 2",
  },

  {
    title: "Movie 3",
    director: "Director 3",
  },

  {
    title: "Movie 4",
    director: "Director 4",
  },

  {
    title: "Movie 5",
    director: "Director 5",
  },

  {
    title: "Movie 6",
    director: "Director 6",
  },

  {
    title: "Movie 7",
    director: "Director 7",
  },

  {
    title: "Movie 8",
    director: "Director 8",
  },

  {
    title: "Movie 9",
    director: "Director 9",
  },

  {
    title: "Movie 10",
    director: "Director 10",
  },
];

// morgan logger
let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(myLogger);

//get requests

app.get("/", (req, res) => {
  res.send("Welcome to the movie API!");
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});
//static
app.use(
  "/documentation",
  express.static("public", { index: "documentation.html" })
);

//error handling midleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something's wrong!`);
});

app.listen(8080, () => {
  console.log("This app is listening on port 8080.");
});
