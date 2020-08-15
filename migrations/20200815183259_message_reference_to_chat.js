exports.up = knex => knex.schema.alterTable('messages', t => {
  t.foreign('chatId').references('chats.id');
});

exports.down = knex => knex.schema.alterTable('messages', t => {
  t.dropForeign('chatId');
});
