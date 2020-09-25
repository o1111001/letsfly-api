exports.up = knex => knex.schema
  .alterTable('chat_subscriptions', t => {
    t.dropForeign('userId');
    t.dropForeign('chatId');
  })
  .dropTable('chat_subscriptions');

exports.down = knex => knex.schema.createTable('chat_subscriptions', t => {
  t.increments('id').unsigned().primary();
  t.integer('userId').notNull();
  t.integer('chatId').notNull();
  t.integer('amount').notNull();

  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.dateTime('endedAt').notNull();

  t.foreign('userId').references('users.id');
  t.foreign('chatId').references('chats.id');
});
