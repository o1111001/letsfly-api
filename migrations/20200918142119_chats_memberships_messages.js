exports.up = knex => knex.schema.createTable('chats_memberships_messages', t => {
  t.integer('messageId').notNull();
  t.integer('chatMembershipId').notNull();

  t.foreign('messageId').references('messages.id');
  t.foreign('chatMembershipId').references('chats_memberships.id');
});

exports.down = knex => knex.schema
  .alterTable('chats_memberships_messages', t => {
    t.dropForeign('messageId');
    t.dropForeign('chatMembershipId');
  })
  .dropTable('chats_memberships_messages');
