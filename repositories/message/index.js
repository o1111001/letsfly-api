const { db } = global;
const promisify = require('../../helpers/promisify');
const { CustomError } = require('../../helpers/errors');
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

  async create(fields) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const { chatId, senderId, text, type, attachment, attachmentId, membershipsList } = fields;
      if (!membershipsList || !membershipsList.length) throw new CustomError('Memberships is required', 500);
      const [{ id: messageId, createdAt }] = await trx('messages')
        .insert({
          senderId,
          text,
          type,
          attachment,
          attachmentId,
        })
        .returning(['id', 'createdAt']);

      const memberships = await trx('chats_memberships')
        .whereIn('id', membershipsList)
        .andWhere({ chatId })
        .select(
          'type',
          'avatar',
          'name',
          'id',
        );

      await trx('chats_memberships_messages')
        .insert(memberships.map(({ id }) => ({ chatMembershipId: id, messageId })));

      await trx.commit();
      return { id: messageId, chatId, senderId, text, attachment, createdAt, type, memberships };
    } catch (error) {
      await trx.rollback(error);
      throw new CustomError('Create message error', 500);
    }
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

  createAttachment({ type, attachment, waveform, filename, resolution, duration, originalName }) {
    return new Promise((resolve, reject) => {
      db('attachments')
        .insert({
          key: attachment,
          type,
          waveform,
          filename,
          resolution,
          duration,
          originalName,
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
