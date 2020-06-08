exports.up = knex => knex.schema.createTable('private_messages', t => {
  t.increments('id').unsigned().primary();
  t.integer('chatId').notNull();
  t.integer('senderId').notNull();
  t.string('text', 1000);
  t.integer('attachmentId');
  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.foreign('senderId').references('users.id');
});

exports.down = knex => knex.schema.dropTable('private_messages');
