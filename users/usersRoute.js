const route = require("express").Router();
const auth = require("../common/authentication");
const Users = require("./usersModel");
const bcrypt = require("bcryptjs");

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

module.exports = route;
