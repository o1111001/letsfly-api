exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.dropForeign('chatId');
  t.foreign('chatId').references('private_chats.id');
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropForeign('chatId');
  t.foreign('chatId').references('private_messages.id');
});

