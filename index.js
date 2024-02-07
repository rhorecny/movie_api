const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");
const app = express();

app.use(bodyParser.json());

//users

let users = [
  {
    "id": "1",
    "name": "John",
    "favoriteMovie":[]
    },
  {
    "id": "2",
    "name": "Ryan",
    "favoriteMovie": ["Star Wars: Episode VII - The Force Awakens", "Avatar"]
  }
]

//top ten list
let movies = [
  {
    Id: "1",
    Title: "Avatar",
      Genre: { 
      "Name": "Action",
      "Description": "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name": "James Cameron"
    },
    ReleaseYear: "2009"
  },

  {
    Id: "2",
    Title: "Avengers: Endgame",
    Genre: { 
      "Name": "Action",
      "Description": "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name": "Anthony Russo"
    },
    ReleaseYear: "2019"
  },

  {
    Id: "3",
    Title: "Avatar: The Way of Water",
    Genre: { 
      "Name": "Action",
      "Description": "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name": "James Cameron"
    },
    ReleaseYear: "2022"
  },

  {
    Id: "4",
    Title: "Titanic",
    Genre: {
      "Name": "Drama",
      "Description": "In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
    },
    Director:{
      "Name": "James Cameron"
    },
    ReleaseYear: "1997"
  },

  {
    Id: "5",
    Title: "Star Wars: Episode VII - The Force Awakens",
    Genre: { 
      "Name": "Action",
      "Description": "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name": "JJ Abrams"
    },
    ReleaseYear: "2015"
  },

  {
    Id: "6",
    Title: "Avengers: Infinity War", 
    Genre: { 
      "Name": "Action",
      "Description": "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name": "Anthony Russo"
    },
    ReleaseYear: "2018"
    
  },

  {
    Id: "7",
    Title: "Spider-Man: No Way Home",
    Genre: { 
      "Name": "Action",
      "Description": "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name": "Jon Watts"
    },
    ReleaseYear: "2021"
  },

  {
    Id: "8",
    Title: "Jurassic World",
    Genre: { 
      Name: "Action",
      Description: "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name":"Colin Trevorrow"
    },
    ReleaseYear: "2015"

  },

  {
    Id: "9",
    Title: "The Lion King",
    Genre:{ 
      Name:  "Animation",
      Description: "Animation is a filmmaking technique by which still images are manipulated to create moving images."
    },
    Director:{
      "Name": "Jon Favreau"
    },
    ReleaseYear: "2019"
  },

  {
    Id: "10",
    Title: "Avengers: Age of Ultron", 
    Genre: { 
      Name: "Action",
      Description: "The action film is a film genre which predominantly feature chase sequences, fights, shootouts, explosions, and stunt work."
    },
    Director:{
      "Name":"Joss Whedon"
    },
    ReleaseYear: "2012"
  },
];

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
  res.status(200).json(movies);
});

app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie in database!");
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
const { genreName } = req.params;
const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

if (genre) {
  res.status(200).json(genre);
} else {
  res.status(400).send("This Genre doesn't exist in this database!")
}
});

app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;
  
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("This Genre doesn't exist in this database!")
  }
  });
  

//post requests
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('Users need names.')
  }

});

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user){
    user.favoriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});


//delete requests
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id);

  if (user){
    user.favoriteMovie = user.favoriteMovie.filter( title => title !== movieTitle)
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id);

  if (user){
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted.`);
  } else {
    res.status(400).send('no such user');
  }
});



//put requests
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id)

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user.')
  }

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
