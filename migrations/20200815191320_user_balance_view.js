
exports.up = knex => knex.schema
  .dropTable('user_balance')
  .raw(
    `CREATE VIEW user_balance as ?`
    , [
      knex.raw(
        `
        select 
          u.id as "userId",
          coalesce(
            (
              (select coalesce(sum(p.amount), 0) from payments p where p."userId" = u.id) -
              (select coalesce(sum(w.amount), 0) from withdrawals w where w."userId" = u.id) - 
              (select coalesce(sum(cs.amount), 0) from chat_subscriptions cs where cs."userId" = u.id)
            ), 
          0) as "balance" 
        from users u
      `,
      ),
    ],
  );

exports.down = knex => knex.schema.raw(
  `DROP VIEW user_balance`,
);