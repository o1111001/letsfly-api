exports.up = knex => knex.schema.alterTable('chats', t => {
  t.string('avatar');
});

exports.down = knex => knex.schema.alterTable('chats', t => {
  t.dropColumn('avatar');
});
