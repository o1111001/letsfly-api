exports.up = knex => knex.schema.alterTable('tokens', t => {
  t.integer('userId').alter();
  t.foreign('userId').references('users.id');
});

exports.down = knex => knex.schema.alterTable('tokens', t => {
  t.dropForeign('userId');
  t.string('userId').alter();
});
