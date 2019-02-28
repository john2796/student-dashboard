exports.up = function(knex, Promise) {
  return knex.schema.createTable("user_projects", tbl => {
    tbl
      .integer("user_id")
      .references("id")
      .inTable("users");
    tbl
      .integer("project_id")
      .references("id")
      .inTable("projects");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("user_projects");
};
