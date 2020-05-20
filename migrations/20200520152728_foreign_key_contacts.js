exports.up = knex => knex.schema.alterTable('contacts', t => {
  t.foreign('userId').references('users.id');
  t.foreign('contact').references('users.id');
});

exports.down = knex => knex.schema.alterTable('contacts', t => {
  t.dropForeign('userId');
  t.dropForeign('contact');
});

