require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const usersRoute = require("./users/usersRoute");
const cohortsRoute = require("./cohorts/cohortsRoute");
const projectsRoute = require("./projects/projectsRoute");
const locationsRoute = require("./locations/locationsRoute");

const server = express();

// Middleware
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(cors());

// Routers
server.use("/api/users", usersRoute);
server.use("/api/cohorts", cohortsRoute);
server.use("/api/projects", projectsRoute);
server.use("/api/locations", locationsRoute);

// Server start
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Listening on port ${port}`));
