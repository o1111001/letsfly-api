exports.up = knex => knex.schema.createTable('chats_memberships_users', t => {
  t.increments('id').unsigned().primary();
  t.integer('userId').notNull();
  t.integer('amount').notNull();
  t.integer('chatMembershipId').notNull();

  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.dateTime('endedAt').notNull();

  t.foreign('userId').references('users.id');
  t.foreign('chatMembershipId').references('chats_memberships.id');
});

exports.down = knex => knex.schema
  .alterTable('chats_memberships_users', t => {
    t.dropForeign('userId');
    t.dropForeign('chatMembershipId');
  })
  .dropTable('chats_memberships_users');
