const Movie = require("../models/Movie.model");
const Celebrities = require("../models/Celebrity.model");
const router = require("express").Router();

router.get("/create", (req, res, next) => {
  Celebrities.find().then((celebrities) => {
    res.render("movies/new-movie", { celebrities });
  });
});

router.post("/create", (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  console.log(req.body.cast);
  Movie.create({ title, genre, plot, cast }).then((movieData) => {
    console.log(`Movie was created successfully`, movieData);
    res.redirect("/movies");
  });
});

router.get("/", (req, res, next) => {
  Movie.find().then((moviesFromDB) => {
    console.log(
      `Movies were successfully retrieved from database:`,
      moviesFromDB
    );
    res.render("movies/movies", { movies: moviesFromDB });
  });
});

router.get("/:id", (req, res, next) => {
  const movieId = req.params.id;

  Movie.findById(movieId)
    .populate(`cast`)
    .then((movie) => {
      console.log(`*********`, movie);
      const celebritiesIDs = movie.cast.map((celebrities) => celebrities._id);
      console.log(`****************`, celebritiesIDs);
      Celebrities.find({ _id: { $in: celebritiesIDs } }).then((celebrities) => {
        console.log(`****`, celebrities);
        console.log(`your retrieved movie by ID :`, movie, celebrities);
        res.render("movies/movie-details", { movie, celebrities });
      });
    });
});
router.post("/:id/delete", (req, res, next) => {
  const { id } = req.params;
  Movie.findByIdAndDelete(id)
    .then((deleted) => {
      console.log(`the movie was successfully deleted:`, deleted);
      res.redirect("/movies");
    })
    .catch((err) => {
      next(err);
    });
});
router.get("/:id/edit", (req, res, next) => {
  const { id } = req.params;

  Movie.findById(id)
    // .populate("cast")
    .then((editMovie) => {
      console.log("#####", editMovie);
      Celebrities.find()
        .then((celebrities) => {
          console.log(`$$$$$$`, celebrities);
          console.log(`you are in editing`, editMovie);
          res.render("movies/edit-movie", { editMovie, celebrities });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

//// the console.log() arent running.
router.post("/:id", (req, res, next) => {
  const { id } = req.params;
  console.log("id");
  const { title, genre, plot, cast } = req.body;
  console.log("updating ", id);
  Movie.findByIdAndUpdate(id, { title, genre, plot, cast }, { new: true }) //i didnt use push and it still works ?
    .then(() => {
      console.log(`Movie with ID: ${id} was updated successfully`);
      res.redirect(`/movies/${id}`);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
