const db = require("../data/dbConfig");

const get = () => db("locations");

const getByUserId = id =>
  db("locations")
    .where({ user_id: id })
    .first();

const add = location => db("locations").insert(location);

const remove = id =>
  db("locations")
    .where({ id })
    .del();

const update = (id, updated) =>
  db("locations")
    .where({ id })
    .update(updated);

module.exports = {
  get,
  getByUserId,
  add,
  remove,
  update
};
