exports.up = knex => knex.schema.createTable('private_chats', t => {
  t.increments('id').unsigned().primary();
  t.integer('user1').notNull();
  t.integer('user2').notNull();
  t.unique(['user1', 'user2']);
});

exports.down = knex => knex.schema.dropTable('private_chats');
