exports.up = knex => knex.schema.createTable('private_attachments', t => {
  t.increments('id').unsigned().primary();
  t.string('type').notNull();
  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
});

exports.down = knex => knex.schema.dropTable('private_attachments');

