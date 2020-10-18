exports.up = knex => knex.schema.alterTable('payments', t => {
  t.dropColumn('orderReference');
  t.string('order').primary();
});

exports.down = knex => knex.schema.alterTable('payments');

