exports.up = knex => knex.schema.createTable('users', t => {
  t.increments('id').unsigned().primary();

  t.string('username').unique().nullable();
  t.string('firstName').nullable();
  t.string('lastName').nullable();
  t.string('email').unique().nullable();
  t.string('phone').unique().nullable();
  t.text('about').nullable();

  t.string('hash').nullable();

  t.dateTime('createdAt').defaultTo(knex.fn.now(6));
  t.dateTime('updatedAt').nullable();
});

exports.down = knex => knex.schema.dropTable('users');

