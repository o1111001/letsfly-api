exports.up = knex => knex.schema.alterTable('chats', t => {
  t.string('type').notNull();
});

exports.down = knex => knex.schema.alterTable('chats', t => {
  t.dropColumn('type');
});
