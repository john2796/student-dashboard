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

  let user_projects;
  if (!name) {
    user_projects = db
      .select()
      .from("user_projects")
      .orderBy("project_id", "desc")
      .paginate(limit, page, true);
  } else {
    user_projects = db
      .select()
      .from("user_projects")
      .orderBy("project_id", "desc")
      .where("project_id", "like", `%${name}%`);
  }

  return user_projects;
}

function findBy(query) {
  return db
    .select()
    .from("user_projects")
    .where(query)
    .first();
}

function insert(project) {
  return db.insert(project).into("user_projects");
}

function remove(id) {
  return db
    .del()
    .from("user_projects")
    .where(id);
}
function update(id, changes) {
  return db
    .update(changes)
    .from("user_projects")
    .where({ id });
}
function findById(id) {
  return db
    .select()
    .from("user_projects")
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
