exports.up = knex => knex.schema.alterTable('users', t => {
  t.boolean('isOnline').defaultTo(false);
});

exports.down = knex => knex.schema.alterTable('users', t => {
  t.dropColumn('isOnline');
});
