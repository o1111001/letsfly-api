exports.up = knex => knex.schema.alterTable('user_balance', t => {
  t.specificType('balance', 'money').default(0).alter();
});

exports.down = knex => knex.schema.alterTable('user_balance');
