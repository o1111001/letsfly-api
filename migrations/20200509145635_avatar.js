exports.up = knex => knex.schema.alterTable('users', t => {
  t.string('avatar');
});

exports.down = knex => knex.schema.alterTable('users', t => {
  t.dropColumn('avatar');
});
