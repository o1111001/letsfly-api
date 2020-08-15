exports.up = knex => knex.schema.alterTable('messages', t => {
  t.boolean('isPublic').notNull().default(false);
});

exports.down = knex => knex.schema.alterTable('messages', t => {
  t.dropColumn('isPublic');
});
