exports.up = knex => knex.schema.alterTable('messages', t => {
  t.dropForeign('chatId');
  t.dropColumn('chatId');
});

exports.down = knex => knex.schema.alterTable('messages', t => {
  t.integer('chatId');
  t.foreign('chatId').references('chats.id');
});
