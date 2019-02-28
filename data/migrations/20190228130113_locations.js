exports.up = function(knex, Promise) {
  return knex.schema.createTable("locations", tbl => {
    tbl.increments();
    tbl.integer("lat");
    tbl.integer("lng");
    tbl
      .integer("user_id")
      .references("id")
      .inTable("users");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("locations");
};
