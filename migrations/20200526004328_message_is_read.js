exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.boolean('isRead').defaultTo(false);
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropColumn('isRead');
});

