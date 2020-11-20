exports.up = knex => knex.schema
  .alterTable('invitations_for_subscription', t => {
    t.dropForeign('chatId');
    t.dropForeign('senderId');
    t.dropForeign('invitedUserId');
  })
  .dropTable('invitations_for_subscription');

exports.down = knex => knex.schema.createTable('invitations_for_subscription', t => {
  t.increments('id').unsigned().primary();
  t.integer('invitedUserId').notNull();
  t.integer('senderId').notNull();
  t.integer('chatId').notNull();
  t.boolean('isActive').default(true).notNull();

  t.foreign('invitedUserId').references('users.id');
  t.foreign('senderId').references('users.id');
  t.foreign('chatId').references('chats.id');
});
