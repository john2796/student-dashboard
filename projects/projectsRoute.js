const route = require("express").Router();
const auth = require("../common/authentication").authenticate;
const PROJECTS = require("./projectsModel");
const USER_PROJECTS = require("../user_projects/userProjectsModel");
// Routes [x] [GET], [POST], [DELETE], [PUT]

const errHelper = (res, err) => {
  res.status(500).json({ message: `${err} ☠️` });
};
const getAllProjects = async (req, res) => {
  try {
    const projects = await PROJECTS.find(req.query);
    res.status(200).json(projects);
  } catch (err) {
    return errHelper(res, err);
  }
};

// @route    GET api/projects/testing
// @desc     testing get all user_projects
// @Access   Public
route.get("/testing", async (req, res) => {
  try {
    const user_projects = await USER_PROJECTS.find(req.query);
    res.status(200).json(user_projects);
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/projects
// @desc     Get All projects
// @Access   Private
route.get("/", auth, (req, res) => {
  getAllProjects(req, res);
});
// @route    GET api/projects/:id
// @desc     get By id
// @Access   Private
route.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await PROJECTS.findById(id);
    res.status(200).json(projects);
  } catch (err) {
    return errHelper(res, err);
  }
});

// @route    GET api/projects
// @desc     Add project
// @Access   Private
route.post("/", auth, async (req, res) => {
  console.log(req.decoded.id);
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name field is required" });
  }

  try {
    const [posted] = await PROJECTS.insert({ name });
    if (posted) {
      const projects = await PROJECTS.find(req.query);
      res.status(200).json(projects);

      await USER_PROJECTS.insert({
        user_id: req.decoded.id,
        project_id: posted
      }).into("user_projects");
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
route.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const user_id = req.decoded.id;

  try {
    const exists = await USER_PROJECTS.findById({ project_id: id });

    if (!exists) {
      return res.status(404).json({ message: "project does not exists" });
    }

    if (exists.user_id !== user_id) {
      return res.status(403).json({
        message: `You cannot delete someone elses project. Your id: ${user_id} their id: ${
          exists.user_id
        }`
      });
    }

    await USER_PROJECTS.remove({ project_id: id });
    await PROJECTS.remove({ id });

    getAllProjects(req, res);
  } catch (err) {
    return errHelper(res, err);
  }
});
// @route    GET api/projects
// @desc     Update project
// @Access   Private
route.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const user_id = req.decoded.id;

  try {
    const exists = await USER_PROJECTS.findById({ project_id: id });

    if (!exists) {
      return res.status(404).json({ message: "project does not exists" });
    }

    if (exists.user_id !== user_id) {
      return res.status(403).json({
        message: `You cannot update someone elses project. Your id: ${user_id} their id: ${
          exists.user_id
        }`
      });
    }

    await PROJECTS.update(id, { name });
    getAllProjects(req, res);
  } catch (err) {
    return errHelper(res, err);
  }
});

module.exports = route;
