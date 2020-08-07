exports.up = knex => knex.schema.alterTable('admins', t => {
  t.string('token');
});

exports.down = knex => knex.schema.alterTable('admins', t => {
  t.dropColumn('token');
});

