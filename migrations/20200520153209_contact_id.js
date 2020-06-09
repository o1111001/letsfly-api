exports.up = knex => knex.schema.alterTable('contacts', t => {
  t.increments('id').unsigned().primary();
});

exports.down = knex => knex.schema.alterTable('contacts', t => {
  t.dropColumn('id');
});
