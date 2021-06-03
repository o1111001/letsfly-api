const { db } = global;

class OnlineStatus {
  constructor(id) {
    this.id = id;
  }

  online() {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({
          id,
        })
        .update({
          isOnline: true,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  offline() {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({
          id,
        })
        .update({
          isOnline: false,
          lastOnline: db.fn.now(6),
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }
}

module.exports = OnlineStatus;
