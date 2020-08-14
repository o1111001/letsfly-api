exports.up = knex => knex.schema.alterTable('contacts', t => {
  t.string('displayedFirstName').notNull();
  t.string('displayedLastName');
  t.dropColumn('displayedName');
});

exports.down = knex => knex.schema.alterTable('contacts', t => {
  t.dropColumn('displayedFirstName');
  t.dropColumn('displayedLastName');
  t.string('displayedName').notNull();
});
