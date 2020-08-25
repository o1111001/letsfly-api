exports.up = knex => knex.schema.alterTable('chats', t => {
  t.boolean('isDeleted').default(false).notNull();
});

exports.down = knex => knex.schema.alterTable('chats', t => {
  t.dropColumn('isDeleted');
});
