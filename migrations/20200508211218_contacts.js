exports.up = knex => knex.schema.createTable('contacts', t => {
  t.string('userId').notNull();
  t.string('contact').nullable();
  t.unique(['userId', 'contact']);
});

exports.down = knex => knex.schema.dropTable('contacts');
