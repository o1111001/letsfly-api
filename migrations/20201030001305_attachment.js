
exports.up = knex => knex.schema.alterTable('attachments', t => {
  t.specificType('resolution', 'INT[]');
});

exports.down = knex => knex.schema.alterTable('attachments', t => {
  t.dropColumn('resolution');
});

