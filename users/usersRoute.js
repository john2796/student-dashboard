const route = require("express").Router();
const Users = require("./usersModel");
const bcrypt = require("bcryptjs");
const auth = require("../common/authentication").authenticate;
const db = require("../data/dbConfig");

// @route    GET api/users/test
// @desc     test
// @Access   Public
route.get("/", async (req, res) => {
  try {
    const users = await db.select().from("users");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});



route.post("/register", (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    res.status(422).json({ message: "All Fields required" });
  } else {
    const hash = bcrypt.hashSync(password, 10);

    Users.add({ firstname, lastname, email, password: hash })
      .then(result => {
        if (result.rowCount) {
          res
            .status(201)
            .json({ message: "User Successfully Registered", success: true });
        } else {
          res.status(401).json({ message: "User already exists" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.detail });
      });
  }
});

route.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ message: "All fields required" });
  } else {
    Users.findBy(email).then(user => {
      if (user) {
        const result = bcrypt.compareSync(password, user.password);
        if (result) {
          auth.genToken(user).then(token => {
            res.json({
              user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
              },
              token
            });
          });
        } else {
          res.status(403).json({ message: "Invalid Credentials" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  }
});

route.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const loggedInUser = req.decoded;

  if (loggedInUser.id === Number(id)) {
    Users.update(id, req.body)
      .then(result => {
        if (result) {
          Users.getById(loggedInUser.id).then(user => {
            res.json(user);
          });
        } else {
          res.status(400).json({ message: "Failed to update profile" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.detail });
      });
  } else {
    res
      .status(401)
      .json({ message: "You can not edit someone else's profile" });
  }
});
module.exports = route;
