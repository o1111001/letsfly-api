

exports.up = knex => knex('users')
  .select()
  .where('id', -1)
  .then(rows => {
    if (!rows.length) {
      return knex('users').insert({ 'id': -1 });
    }
  });

exports.down = () => {};
