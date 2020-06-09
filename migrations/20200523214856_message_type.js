exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.string('type').defaultTo('text');
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropColumn('type');
});
