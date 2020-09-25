exports.up = knex => knex.schema.createTable('chats_memberships', t => {
  t.increments('id').unsigned().primary();
  t.integer('chatId').notNull();
  t.integer('amount').notNull();
  t.string('type').notNull();

  t.string('avatar');
  t.string('name').notNull();
  t.string('description');

  t.boolean('isDeleted').defaultTo(false);

  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.dateTime('updatedAt').defaultTo(knex.fn.now(6));
  t.dateTime('deletedAt');

  t.foreign('chatId').references('chats.id');
});

exports.down = knex => knex.schema
  .alterTable('chats_memberships', t => {
    t.dropForeign('chatId');
  })
  .dropTable('chats_memberships');
