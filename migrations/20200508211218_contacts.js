exports.up = knex => knex.schema.createTable('contacts', t => {
  t.integer('userId').notNull();
  t.integer('contact').nullable();
  t.unique(['userId', 'contact']);
});

exports.down = knex => knex.schema.dropTable('contacts');
