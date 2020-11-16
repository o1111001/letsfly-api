exports.up = knex =>  knex.schema.alterTable('tokens', t => {
  t.string('access').notNull().alter();
});

exports.down = knex => knex.schema.alterTable('tokens', t => {
  t.string('access').nullable().alter();
});
