const { db } = global;

class Message {
  createAttachment(type) {
    const { attachment } = this;
    return new Promise((resolve, reject) => {
      db('attachments')
        .insert({
          path: attachment,
          type,
        })
        .returning(['id'])
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
}

module.exports = new Message();
