
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'Lambda Student 1', cohort_id: 1},
        {name: 'Lambda Student 2', cohort_id: 2},
        {name: 'Lambda Student 3', cohort_id: 3}
      ]);
    });
};
