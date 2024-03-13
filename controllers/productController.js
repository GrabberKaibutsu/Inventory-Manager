const express = require("express");

const router = express.Router();

const isAuthenticated = require("./isAuthenicated");


const db = require("../models");

router.use(isAuthenticated);


router.get("/", (req, res) => {
  console.log(req.session)
  db.Products.find({ user: req.session.currentUser._id }).then((product) => {
    res.render("home", { 
      product: product,
        currentUser: req.session.currentUser
     });
  });
});

router.get("/new", (req, res) => {
  res.render("new-fruit", { currentUser: req.session.currentUser });
});


router.post("/", async (req, res) => {
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  console.log(req.session);
  req.body.user = req.session.currentUser._id;
  await db.Products.create(req.body).then((product) =>
    res.redirect("/main/" + product._id)
  );
});


router.get("/:id", function (req, res) {
  db.Products.findById(req.params.id)
    .then((product) => {
      res.render("details", {
        product: product,
        currentUser: req.session.currentUser 
      });
    })
    .catch(() => res.render("404"));
});


router.get("/:id/edit", (req, res) => {
  db.Products.findById(req.params.id).then((product) => {
    res.render("edit", {
      product: product,
      currentUser: req.session.currentUser 
    });
  });
});


router.put("/:id", async (req, res) => {
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  await db.Products.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (product) => res.redirect("/main/" + product._id)
  );
});

router.delete("/:id", async (req, res) => {
  await db.Products.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/main")
  );
});

module.exports = router;
