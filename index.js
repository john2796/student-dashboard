require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

// routes
const usersRoute = require("./users/usersRoute");
const cohortsRoute = require("./cohorts/cohortsRoute");
const projectsRoute = require("./projects/projectsRoute");
const locationsRoute = require("./locations/locationsRoute");

const server = express();

// Middleware
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan("dev"));

// Use Routers
server.use("/api/users", usersRoute);
server.use("/api/cohorts", cohortsRoute);
server.use("/api/projects", projectsRoute);
server.use("/api/locations", locationsRoute);

// 404
server.use(function(req, res, next) {
  return res
    .status(404)
    .send({ message: "[Route] --> " + req.url + " <-- Not found." });
});
// 500 - Any server error
server.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
});

// Server start
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));
