const Celebrities = require("../models/Celebrity.model");

// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

router.get("/create", (req, res, next) => {
  res.render("celebrities/new-celebrity");
});

router.post("/create", (req, res, next) => {
  const { name, occupation, catchphrase } = req.body;

  if (!name) {
    res.render("celebrities/new-celebrity", {
      Emptymessage: "Error, Please fill the form",
    });
    return; // Return to stop further execution
  }
  Celebrities.findOne({ name })
    .then((celebName) => {
      console.log(`Celebrity name`, celebName);

      if (celebName === null) {
        Celebrities.create({ name, occupation, catchphrase })
          .then((newCelebrity) => {
            console.log("The celebrity was Created:", newCelebrity);
            res.render("celebrities/new-celebrity", {
              message: `The celebrity ${name} was created`,
            });
          })
          .catch((err) => {
            console.log(`Error while creating a new Celebrity ${err}`);
          });
      } else {
        res.render("celebrities/new-celebrity", {
          Errormessage: "Error, this name already exists, try a new one.",
        });
      }
    })
    .catch((err) => {
      console.log(`Error while Creating a new Celebrity ${err}`);
    });
});

router.get("/", (req, res, next) => {
  Celebrities.find().then((celebrities) => {
    console.log(
      "the celebrity Database was successfully retrieved:",
      celebrities
    );
    res.render("celebrities/celebrities", { celebrities });
  });
});

router.get("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  Celebrities.findById(id)
    .then((celebrity) => {
      console.log(`****${celebrity}***`);
      console.log(`the celebrity you selected to edit is:`, celebrity);
      res.render("celebrities/celebrity-edit", { celebrity });
    })
    .catch((err) => {
      next(err);
    });
});
router.post("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, occupation, catchphrase } = req.body;
  console.log(name, occupation);
  Celebrities.findByIdAndUpdate(
    id,
    { name, occupation, catchphrase },
    { new: true }
  ).then((updatedCelebrity) => {
    console.log(`You successfully updated celebrity`, updatedCelebrity);
    res.redirect(`/celebrities`);
  });
});
router.post("/:id/delete", (req, res, next) => {
  const { id } = req.params;

  Celebrities.findByIdAndDelete(id).then((deleted) => {
    console.log(`This celebrity was deleted:`, deleted);
    res.redirect("/celebrities");
  });
});
module.exports = router;
