const route = require("express").Router();
const auth = require("../common/authentication").authenticate;
const COHORTS = require("./cohortsModel");
// Routes [x] [GET], [POST], [DELETE], [PUT]

const errHelper = (res, err) => {
  res.status(500).json({ message: `${err} ☠️` });
};
const getAllCohorts = async (req, res) => {
  try {
    const cohorts = await COHORTS.find(req.query);
    res.status(200).json(cohorts);
  } catch (err) {
    return errHelper(res, err);
  }
};

// @route    GET api/cohorts
// @desc     get all cohort
// @Access   private
route.get("/", auth, async (req, res) => {
  getAllCohorts(req, res);
});

// @route    GET api/cohorts/:id
// @desc     Get by id
// @Access   private
route.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const cohort = await COHORTS.findById({ id });
    if (cohort) {
      res.status(200).json(cohort);
    } else {
      res.status(404).json({ message: "cohort not found " });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    POST api/cohorts
// @desc     add cohort
// @Access   Private
route.post("/", auth, async (req, res) => {
  const { cohort_name, slack } = req.body;
  if (!cohort_name) {
    return res.status(400).json({ message: "cohort name is required" });
  }
  try {
    const [posted] = await COHORTS.insert({ cohort_name, slack });
    if (posted) {
      getAllCohorts(req, res);
    } else {
      res.status(404).json({ message: "cohort with that id is not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});
// @route    PUT api/cohorts/:id
// @desc     update cohort
// @Access   Private
route.put("/:id", auth, async (req, res) => {
  const { cohort_name, slack } = req.body;
  const { id } = req.params;
  if (!cohort_name) {
    return res.status(400).json({ message: "cohort name is required" });
  }
  try {
    const updated = await COHORTS.update(id, { cohort_name, slack });
    if (updated) {
      getAllCohorts(req, res);
    } else {
      res.status(404).json({ message: "cohort with that id is not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});
// @route    DELETE api/cohorts/:id
// @desc     DELETE a cohort
// @Access   Private
route.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await COHORTS.remove({ id });
    if (updated) {
      getAllCohorts(req, res);
    } else {
      res.status(404).json({ message: "cohort with that id is not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

module.exports = route;
