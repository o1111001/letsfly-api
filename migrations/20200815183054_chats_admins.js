exports.up = knex => knex.schema.createTable('chats_admins', t => {
  t.integer('chatId').notNull();
  t.integer('adminId').notNull();

  t.foreign('chatId').references('chats.id');
  t.foreign('adminId').references('users.id');
});

exports.down = knex => knex.schema.dropTable('chats_admins');
