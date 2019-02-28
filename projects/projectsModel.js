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
  let projects;

  if (!name) {
    projects = db
      .select()
      .from("projects")
      .orderBy("id", "desc")
      .paginate(limit, page, true);
  } else {
    projects = db
      .select()
      .from("projects")
      .orderBy("id", "desc")
      .where("name", "like", `%${name}%`);
  }

  return projects;
}

function findBy(query) {
  return db
    .select()
    .from("projects")
    .where(query)
    .first();
}
function findById(id) {
  return db
    .select()
    .from("projects")
    .where({ id })
    .first();
}

function insert(project) {
  return db.insert(project).into("projects");
}

function remove(id) {
  return db
    .del()
    .from("projects")
    .where(id);
}
function update(id, changes) {
  return db
    .update(changes)
    .from("projects")
    .where({ id });
}
/*
find
findById 
insert
remove --> DELETE
update
findBy --> query
*/
