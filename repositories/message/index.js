const { db } = global;

class Message {
  get({ id }) {
    return new Promise((resolve, reject) => {
      db('messages')
        .where({
          id,
        })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  create(fields) {
    const { chatId, senderId, text, type, attachment, attachmentId } = fields;
    return new Promise((resolve, reject) => {
      db('messages')
        .insert({
          chatId,
          senderId,
          text,
          type,
          attachment,
          attachmentId,
        })
        .returning(['id', 'chatId', 'senderId', 'text', 'attachment', 'createdAt', 'type'])
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  deleteById({ id }) {
    return new Promise((resolve, reject) => {
      db('messages')
        .update({
          isDeleted: true,
        })
        .where({
          id,
        })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  createAttachment({ type, attachment }) {
    return new Promise((resolve, reject) => {
      db('attachments')
        .insert({
          path: attachment,
          type,
        })
        .returning(['id'])
        .then(res => resolve(res[0].id))
        .catch(err => reject(err));
    });
  }

  changePublicity({ id, isPublic }) {
    return new Promise((resolve, reject) => {
      db('messages')
        .update({
          isPublic,
        })
        .where({ id })
        .returning('id')
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }
}


module.exports = new Message();
