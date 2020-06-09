exports.up = knex => knex.schema.alterTable('users', t => {
  t.dateTime('lastOnline').defaultTo(knex.fn.now(6));
});

exports.down = knex => knex.schema.alterTable('users', t => {
  t.dropColumn('lastOnline');
});
