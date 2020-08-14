exports.up = knex => knex.schema.createTable('user_balance', t => {
  t.integer('userId').notNull();
  t.integer('balance').defaultTo(0);
  t.unique('userId');
  t.foreign('userId').references('users.id');
});

exports.down = knex => knex.schema.dropTable('user_balance');
