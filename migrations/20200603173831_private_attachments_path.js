exports.up = knex => knex.schema.alterTable('private_attachments', t => {
  t.string('path').notNull();
});

exports.down = knex => knex.schema.alterTable('private_attachments', t => {
  t.dropColumn('path').notNull();
});
