exports.up = knex => knex.schema
  .alterTable('chats_users', t => {
    t.dropForeign('userId');
    t.dropForeign('chatId');
  })
  .dropTable('chats_users');

exports.down = knex => knex.schema.createTable('chats_users', t => {
  t.integer('chatId').notNull();
  t.integer('userId').notNull();

  t.foreign('chatId').references('chats.id');
  t.foreign('userId').references('users.id');
});
