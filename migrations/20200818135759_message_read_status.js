exports.up = knex => knex.schema.createTable('messages_is_read', t => {
  t.integer('userId').notNull();
  t.integer('messageId').notNull();
  t.boolean('isRead').default(false).notNull();

  t.foreign('userId').references('users.id');
  t.foreign('messageId').references('messages.id');
});

exports.down = knex => knex.schema.dropTable('messages_is_read');


