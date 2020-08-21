exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.boolean('isDeleted').notNull().default(false);
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropColumn('isDeleted');
});
