exports.up = knex => knex.schema.alterTable('contacts', t => {
  t.string('displayedName');
});

exports.down = knex => knex.schema.alterTable('contacts', t => {
  t.dropColumn('displayedName');
});
