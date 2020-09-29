exports.up = knex => knex.schema
  .alterTable('private_messages', t => {
    t.dropForeign('chatId');
  })
  .renameTable('private_messages', 'messages')
  .renameTable('private_attachments', 'attachments');


exports.down = knex => knex.schema
  .renameTable('messages', 'private_messages')
  .renameTable('attachments', 'private_attachments');

