exports.up = knex => knex.schema.createTable('chats_users', t => {
  t.integer('chatId').notNull();
  t.integer('userId').notNull();

  t.foreign('chatId').references('chats.id');
  t.foreign('userId').references('users.id');
});

exports.down = knex => knex.schema.dropTable('chats_users');
