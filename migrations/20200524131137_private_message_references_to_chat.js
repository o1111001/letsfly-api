exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.foreign('chatId').references('private_messages.id');
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropForeign('chatId');
});
