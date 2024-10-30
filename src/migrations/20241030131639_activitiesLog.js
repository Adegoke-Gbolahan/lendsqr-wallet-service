
export const up = async (knex) => {
    return knex.schema.createTable('user_logs', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('activity_type').notNullable(); 
      table.text('description').notNullable(); 
      table.decimal('amount', 14, 2).defaultTo(0); 
      table.timestamp('created_at').defaultTo(knex.fn.now());

  
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.dropTable('user_logs');
  };
  