const express = require("express");
const router = express.Router();


router.get("/product", (req, res) => {
      res.render("home", {
       });
    });

    module.exports = router;