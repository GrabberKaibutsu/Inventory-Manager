/* const db = require("../models");
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/fruits`
---------------------------------------------------------------------------------------
*/

/* Require modules
--------------------------------------------------------------- */
const express = require("express");
// Router allows us to handle routing outisde of server.js
const router = express.Router();
// bring in the isAuthenticated middleware
const isAuthenticated = require("../controllers/isAuthenticated");

/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require("../models");

router.use(isAuthenticated);

// I.N.D.U.C.E.S
// INDEX - see all items routes. get all items out the db and send to the user
router.get("/", (req, res) => {
  // db.User.xyz..
  console.log(req.session)
  db.Fruit.find({ user: req.session.currentUser._id }).then((fruits) => {
    res.render("fruit-home", { 
        fruits: fruits,
        currentUser: req.session.currentUser
     });
  });
  // res.send(fruits) - res.send sends back raw data or html
  // to send ejs we use
  // ------- res.render(view, {data})
  // - view represents an ejs page, will check for this file name in the views folder
  // noramally in an object {keßy: value}
  // when a key and value have the same name you ca n just put the variable there
});

// NEW - Send back a form to create new fruits
router.get("/new", (req, res) => {
  res.render("new-fruit", { currentUser: req.session.currentUser });
});

// CREATE / POST / route= "/fruits"
// The goal of the post route is to take data
// from the form or request and try to
// create some data in the database
// req.body - this is the form data from the request.
router.post("/", async (req, res) => {
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  console.log(req.session);
  req.body.user = req.session.currentUser._id;
  await db.Fruit.create(req.body).then((fruit) =>
    res.redirect("/fruits/" + fruit._id)
  );
});

// Show Route (GET/Read): Will display an individual fruit document
// using the URL parameter (which is the document _id)
router.get("/:id", function (req, res) {
  db.Fruit.findById(req.params.id)
    .then((fruit) => {
      res.render("fruit-details", {
        fruit: fruit,
        currentUser: req.session.currentUser 
      });
    })
    .catch(() => res.render("404"));
});

// Edit Route (GET/Read): This route renders a form
// the user will use to PUT (edit) properties of an existing fruit
router.get("/:id/edit", (req, res) => {
  db.Fruit.findById(req.params.id).then((fruit) => {
    res.render("edit-fruit", {
      fruit: fruit,
      currentUser: req.session.currentUser 
    });
  });
});

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route,
// edits the specified fruit document using the form data,
// and redirects the user back to the show page for the updated location.
router.put("/:id", async (req, res) => {
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  await db.Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (fruit) => res.redirect("/fruits/" + fruit._id)
  );
});

// Destroy Route (DELETE/Delete): This route deletes a fruit document
// using the URL parameter (which will always be the fruit document's ID)
router.delete("/:id", async (req, res) => {
  await db.Fruit.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/fruits")
  );
});

module.exports = router;
