exports.up = knex => knex.schema.alterTable('user_balance', t => {
  t.specificType('balance', 'money').alter();
});

exports.down = knex => knex.schema.alterTable('user_balance', t => {
  t.integer('balance').alter();
});
