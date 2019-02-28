exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tbl => {
    tbl.increments();
    tbl.string("firstname").notNullable();
    tbl.string("lastname").notNullable();
    tbl
      .string("email")
      .notNullable()
      .unique();
    tbl.string("password").notNullable();
    tbl.string("avatar");
    tbl
      .integer("cohort_id")
      .references("id")
      .inTable("cohorts");
    tbl.string("github");
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
