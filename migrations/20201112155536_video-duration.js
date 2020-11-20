exports.up = knex => knex.schema.alterTable('attachments', t => {
  t.integer('duration');
});

exports.down = knex => knex.schema.alterTable('attachments', t => {
  t.dropColumn('duration');
});

