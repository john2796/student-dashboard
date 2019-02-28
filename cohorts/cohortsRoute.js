const route = require("express").Router();
const db = require("./cohortsModel");

// Routes [x] [GET], [POST], [DELETE], [PUT]

const errHelper = (res, err) => {
  res.status(500).json({ message: `${err} ☠️` });
};
// @route    GET api/cohorts
// @desc     test
// @Access   Private
route.get("/", async (req, res) => {
  try {
    const cohorts = await db.find(req.query);
    res.status(200).json(cohorts);
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/cohorts
// @desc     Add cohort
// @Access   Private
route.post("/", async (req, res) => {
  const { cohort_name, slack } = req.body;
  if (!cohort_name) {
    return res.status(400).json({ message: "cohort_name field is required" });
  }

  try {
    const posted = await db.insert({ cohort_name, slack });
    if (posted) {
      const cohorts = await db.find(req.query);
      res.status(200).json(cohorts);
    } else {
      res.status(400).json({ message: "failed to post cohort" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/cohorts
// @desc     Remove cohort
// @Access   Private
route.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await db.remove({ id });
    if (removed) {
      const cohorts = await db.find(req.query);
      res.status(200).json(cohorts);
    } else {
      res.status(404).json({ message: "cohort not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/cohorts
// @desc     Update cohort
// @Access   Private
route.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { cohort_name, slack } = req.body;
  if (!cohort_name) {
    return res.status(400).json({ message: "cohort_name field is required" });
  }
  try {
    const updated = await db.update(id, { cohort_name, slack });
    if (updated) {
      const cohorts = await db.find(req.query);
      res.status(200).json(cohorts);
    } else {
      res.status(404).json({ message: "cohort not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

module.exports = route;
