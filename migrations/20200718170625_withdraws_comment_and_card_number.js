exports.up = knex => knex.schema.alterTable('withdrawals', t => {
  t.string('comment');
  t.string('cardNumber').notNull();

});

exports.down = knex => knex.schema.alterTable('withdrawals', t => {
  t.dropColumn('comment');
  t.dropColumn('cardNumber');
});


