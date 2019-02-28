const route = require("express").Router();
const auth = require("../common/authentication").authenticate;
const db = require("./projectsModel");

// Routes [x] [GET], [POST], [DELETE], [PUT]

const errHelper = (res, err) => {
  res.status(500).json({ message: `${err} ☠️` });
};
// @route    GET api/projects
// @desc     Get All projects
// @Access   Private
route.get("/", auth, async (req, res) => {
  try {
    const projects = await db.find(req.query);
    res.status(200).json(projects);
  } catch (err) {
    return errHelper(res, err);
  }
});
// @route    GET api/projects/:id
// @desc     get By id
// @Access   Private
route.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await db.findById(id);
    res.status(200).json(projects);
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/projects
// @desc     Add project
// @Access   Private
route.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name field is required" });
  }

  try {
    const posted = await db.insert({ name });
    if (posted) {
      const projects = await db.find(req.query);
      res.status(200).json(projects);
    } else {
      res.status(400).json({ message: "failed to post project" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/projects
// @desc     Remove project
// @Access   Private
route.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await db.remove({ id });
    if (removed) {
      const projects = await db.find(req.query);
      res.status(200).json(projects);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/projects
// @desc     Update project
// @Access   Private
route.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name field is required" });
  }
  try {
    const updated = await db.update(id, { name });
    if (updated) {
      const projects = await db.find(req.query);
      res.status(200).json(projects);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    return errHelper(res, err);
  }
});

module.exports = route;
