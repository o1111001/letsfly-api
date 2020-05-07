exports.up = knex => knex.schema.createTable('users', t => {
  t.increments('id').unsigned().primary();

  t.string('name').nullable();
  t.string('firstName').nullable();
  t.string('lastName').nullable();
  t.string('email').nullable();
  t.string('phone').nullable();
  t.text('about').nullable();

  t.text('hash').nullable();

  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.dateTime('updatedAt').nullable();
});

exports.down = knex => knex.schema.dropTable('users');

