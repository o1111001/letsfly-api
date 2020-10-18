exports.up = knex => knex.schema.alterTable('payments', t => {
  t.dropColumn('id');
  // t.dropColumn('order');
  // t.string('order').primary();
});

exports.down = knex => knex.schema.alterTable('payments');

