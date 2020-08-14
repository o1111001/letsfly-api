exports.up = knex => knex.schema.createTable('admins', t => {
  t.increments('id').unsigned().primary();
  t.integer('userId').notNull();
  t.string('hash').nullable();
  t.foreign('userId').references('users.id');
});

exports.down = knex => knex.schema.dropTable('admins');


