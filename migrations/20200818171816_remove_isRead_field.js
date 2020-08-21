exports.up = knex => knex.schema.alterTable('messages', t => {
  t.dropColumn('isRead');
});

exports.down = knex => knex.schema.alterTable('messages', t => {
  t.boolean('isRead');
});
