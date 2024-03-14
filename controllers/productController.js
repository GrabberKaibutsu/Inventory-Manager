const express = require("express");

const router = express.Router();

const isAuthenticated = require("./isAuthenicated");


const db = require("../models");

router.use(isAuthenticated);


router.get("/", (req, res) => {
  console.log(req.session)
  db.product.find({ user: req.session.currentUser._id }).then((product) => {
    res.render("home", { 
      product: product,
        currentUser: req.session.currentUser
     });
  });
});

router.get("/new", (req, res) => {
  res.render("newProduct", { currentUser: req.session.currentUser });
});


router.post("/", async (req, res) => {
  req.body.isLow = req.body.isLow === "on" ? true : false;
  console.log(req.session);
  req.body.user = req.session.currentUser._id;
  await db.product.create(req.body).then((product) =>
    res.redirect("/main/" + product._id)
  );
});


router.get("/:id", function (req, res) {
  db.product.findById(req.params.id)
    .then((product) => {
      res.render("details", {
        product: product,
        currentUser: req.session.currentUser 
      });
    })
    .catch(() => res.render("404"));
});


router.get("/:id/edit", (req, res) => {
  db.product.findById(req.params.id).then((product) => {
    res.render("edit", {
      product: product,
      currentUser: req.session.currentUser 
    });
  });
});


router.put("/:id", async (req, res) => {
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  await db.product.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(
    (product) => res.redirect("/main/" + product._id)
  );
});

router.delete("/:id", async (req, res) => {
  await db.product.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/main")
  );
});

module.exports = router;
