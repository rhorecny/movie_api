const express = require("express");
const app = express();
const bodyParser = require("body-parser");
uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models");
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//update

// Update a user's info, by username

app.put("/users/:UserName", async (req, res) => {
  await Users.findOneAndUpdate(
    { UserName: req.params.UserName },
    {
      $set: {
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//CREATE

//Add a user

app.post("/users", async (req, res) => {
  await Users.findOne({ UserName: req.body.UserName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.UserName + "already exists");
      } else {
        Users.create({
          UserName: req.body.UserName,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Add a movie to a user's list of favorites
app.post("/users/:UserName/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { UserName: req.params.UserName },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});



//GET requests

app.get("/", (req, res) => {
  res.send("Welcome to the Movie API");
});


//Movie requests
app.get("/movies", async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/:Title", async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/genre/:genreName", async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/directors/:directorName", async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


//User requests
app.get("/users", async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


app.get("/users/:UserName", async (req, res) => {
  await Users.findOne({ UserName: req.params.UserName })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//DELETE requests
app.delete("/users/:UserName/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate({ UserName: req.params.UserName}, {
    $pull:{FavoriteMovies: req.params.MovieID}
  },
  { new: true})
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.delete("/users/:UserName", async (req, res) => {
  await Users.findOneAndDelete({ UserName: req.params.UserName})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.UserName + " was not found.");
    } else {
      res.status(200).send(req.params.UserName + " was deleted.");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Erorr: " + err);
  });
});

//Documentation request
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// // Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something's wrong!`);
});

// Listen for requests
app.listen(8080, () => {
  console.log("This app is listening on port 8080.");
});