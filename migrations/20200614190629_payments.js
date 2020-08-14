exports.up = knex => knex.schema.createTable('payments', t => {
  t.increments('id').unsigned().primary();
  t.string('orderReference').notNull();
  t.string('signature').notNull();
  t.integer('userId').notNull();
  t.integer('amount').notNull();
  t.string('status').notNull();
  t.dateTime('updatedAt').defaultTo(knex.fn.now(6));
  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.foreign('userId').references('users.id');
});

exports.down = knex => knex.schema.dropTable('payments');

