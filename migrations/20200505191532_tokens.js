exports.up = knex => knex.schema.createTable('tokens', t => {
  t.increments('id').unsigned().primary();
  t.string('userId').notNull();
  t.string('token').nullable();
});

exports.down = knex => knex.schema.dropTable('tokens');


