exports.up = knex => knex.schema
  .createTable('login_codes', t => {
    t.increments('id').unsigned().primary();

    t.integer('userId').notNull().unique();
    t.string('code').notNull();
    t.integer('attempts').default(0).notNull();
    t.dateTime('expires').notNull();

    t.index('code');

    t.foreign('userId').references('users.id');
  })
  .alterTable('users', t => {
    t.dropColumn('hash');
  });

exports.down = knex => knex.schema
  .dropTable('login_codes')
  .alterTable('users', t => {
    t.string('hash');
  });
