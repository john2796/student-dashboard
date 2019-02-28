exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("projects")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("projects").insert([
        {
          name: "project name",
          tag: 1,
          progress: 0
        },
        {
          name: "project name",
          tag: 1,
          progress: 0
        },
        {
          name: "project name",
          tag: 1,
          progress: 0
        }
      ]);
    });
};
