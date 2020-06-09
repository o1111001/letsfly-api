exports.up = knex => knex.schema.createTable('banned_users', t => {
  t.integer('user').notNull();
  t.integer('bannedUser').notNull();
  t.foreign('user').references('users.id');
  t.foreign('bannedUser').references('users.id');
});

exports.down = knex => knex.schema.dropTable('banned_users');


