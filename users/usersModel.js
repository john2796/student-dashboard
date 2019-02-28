const db = require("../data/dbConfig");

const get = () => db("users");

const findBy = query =>
  db("users")
    .where({ email: query })
    .first();

const getById = id =>
  db("users")
    .where({ id })
    .first();

const add = user => db("users").insert(user);

const remove = id =>
  db("users")
    .where({ id })
    .del();

const update = (id, changes) =>
  db("users")
    .where({ id })
    .update(changes);

module.exports = {
  get,
  getById,
  add,
  remove,
  update,
  findBy
};
