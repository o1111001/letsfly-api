exports.up = knex => knex.schema.alterTable('chats', t => {
  t.dropColumn('type');
  t.dropColumn('price');

});

exports.down = knex => knex.schema.alterTable('chats', t => {
  t.string('type').notNull();
  t.integer('price');
});
