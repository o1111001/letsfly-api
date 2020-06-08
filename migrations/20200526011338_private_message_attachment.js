exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.string('attachment');
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropColumn('attachment');
});

