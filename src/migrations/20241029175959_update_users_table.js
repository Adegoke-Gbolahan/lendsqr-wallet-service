/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('name');  // Drop 'name' if it exists

    // Add new fields with valid constraints
    table.string('first_name').notNullable();
    table.string('middle_name').nullable();
    table.string('last_name').notNullable();
    table.date('dob').nullable();  // Allow 'dob' to be nullable
    table.enu('gender', ['male', 'female', 'other']).notNullable();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumns('first_name', 'middle_name', 'last_name', 'dob', 'gender');
  });
};
