const { db } = global;

class Analytics {
  constructor(id) {
    this.id = id;
  }

  get() {
    return new Promise((resolve, reject) => {
      db.raw(
        `select 
        (select count(*)::int as "users" from users),
        (select count(*)::int as "online" from users u where u."isOnline" = true),
        (select count(*)::int as "messages" from private_messages),
        (select count(*)::int as "paymentsCount" from payments where status = 'Approved'),
        (select coalesce(sum(amount), 0)::int as "paymentsAmount" from payments where status = 'Approved'),
        (select 0 as "subcriptionCount"),
        (select 0 as "subcriptionAmount"),
        (select count(*)::int as "withdrawsCount" from withdrawals where status = 'approved'),
        (select coalesce(sum(amount), 0)::int as "withdrawsAmount" from withdrawals where status = 'approved'),
        (select 0 as "grossIncomeAmount")
        `,
        [],
      )
        .then(result => resolve(result.rows[0]))
        .catch(err => reject(err));
    });
  }
}

module.exports = Analytics;
