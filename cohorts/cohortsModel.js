const db = require("../data/dbConfig");
module.exports = {
  find,
  findBy,
  insert,
  remove,
  update,
  findById
};

function find(query) {
  const { limit = 10, page = 1, name } = query;

  let cohorts;
  if (!name) {
    cohorts = db
      .select()
      .from("cohorts")
      .orderBy("id", "desc")
      .paginate(limit, page, true);
  } else {
    cohorts = db
      .select()
      .from("cohorts")
      .orderBy("id", "desc")
      .where("name", "like", `%${name}%`);
  }

  return cohorts;
}

function findBy(query) {
  return db
    .select()
    .from("cohorts")
    .where(query)
    .first();
}

function insert(project) {
  return db
    .insert(project)
    .into("cohorts")
    .returning("id");
}

function remove(id) {
  return db
    .del()
    .from("cohorts")
    .where(id);
}
function update(id, changes) {
  return db
    .update(changes)
    .from("cohorts")
    .where({ id });
}
function findById(id) {
  return db
    .select()
    .from("cohorts")
    .where(id)
    .first();
}
/*
find
findById 
insert
remove --> DELETE
update
findBy --> query
*/
