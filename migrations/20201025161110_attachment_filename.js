exports.up = knex => knex.schema.alterTable('attachments', t => {
  t.string('filename');
});

exports.down = knex => knex.schema.alterTable('attachments', t => {
  t.dropColumn('filename');
});

