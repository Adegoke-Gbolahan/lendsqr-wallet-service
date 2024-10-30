/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('users', (table) => {
      table.string('phone_number', 15).notNullable().unique();
    });
  };
  
  /**
   * @param {import('knex').Knex} knex
   */
  exports.down = async function (knex) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('phone_number');
    });
  };
  