const route = require("express").Router();

// @route    GET api/projects
// @desc     test
// @Access   Public
route.get("/", (req, res) => {
  res.send("it works");
});

module.exports = route;
