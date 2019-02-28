const route = require("express").Router();
const Locations = require("./locationsModel");
const Users = require("../users/usersModel");
const auth = require("../common/authentication").authenticate;

route.get("/", auth, (req, res) => {
  Locations.get()
    .then(locations => {
      res.json(locations);
    })
    .catch(error => {
      res.status(500).json({ message: error.detail });
    });
});

route.post("/", auth, (req, res) => {
  const { user_id, lat, lng } = req.body;

  if (!user_id || !lat || !lng) {
    res.status(422).json({ message: "All  fields required" });
  } else {
    Users.getById(user_id).then(user => {
      if (user) {
        Locations.add({ user_id, lat, lng })
          .then(result => {
            if (result.rowCount) {
              Locations.get().then(locations => {
                res.json(locations);
              });
            } else {
              res.status(401).json({ message: "Failed to add location" });
            }
          })
          .catch(error => {
            res.status(500).json({ message: error.detail });
          });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  }
});

route.get("/:id", auth, (req, res) => {
  const { id } = req.params;

  Users.getById(id)
    .then(user => {
      if (user) {
        Locations.getByUserId(id).then(location => {
          res.json(location);
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.detail });
    });
});

route.delete("/:id", auth, (req, res) => {
  const { id } = req.params;

  Locations.remove(id)
    .then(result => {
      if (result) {
        Locations.get().then(locations => {
          res.json(locations);
        });
      } else {
        res.status(401).json({ message: "Failed to delete location" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.detail });
    });
});

route.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { lng, lat } = req.body;

  Locations.update(id, { lng, lat })
    .then(result => {
      if (result) {
        Locations.get().then(locations => {
          res.json(locations);
        });
      } else {
        res.status(401).json({ message: "failed to update location" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.detail });
    });
});
module.exports = route;
