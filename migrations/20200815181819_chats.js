exports.up = knex => knex.schema.createTable('chats', t => {
  t.increments('id').unsigned().primary();
  t.string('name');
  t.string('description');
  t.string('type').notNull();
  t.string('link');
  t.string('price');
});

exports.down = knex => knex.schema.dropTable('chats');


