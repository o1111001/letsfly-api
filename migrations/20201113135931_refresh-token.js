exports.up = knex => knex.schema.alterTable('tokens', t => {
  t.string('token').notNull().alter();
  t.renameColumn('token', 'access');
  t.string('refresh').notNull();
  t.string('fingerprint').notNull();
  t.dateTime('refreshExpire').notNull();
});

exports.down = knex => knex.schema.alterTable('tokens', t => {
  t.dropColumn('refresh');
  t.renameColumn('access', 'token');
  t.dropColumn('refreshExpire');
});
