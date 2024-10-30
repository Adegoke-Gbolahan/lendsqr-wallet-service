/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary(); 
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('bvn', 11).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('wallets', (table) => {
        table.increments('id').primary(); 
        table.integer('user_id').unsigned().notNullable();
        table.decimal('balance', 12, 2).defaultTo(0.00); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      });
  };
  
  /**
   * @param {import('knex').Knex} knex
   */
  exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('wallets');
  };
  