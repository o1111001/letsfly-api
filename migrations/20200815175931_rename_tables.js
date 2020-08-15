exports.up = knex => knex.schema
  .renameTable('private_messages', 'messages')
  .renameTable('private_chats', 'chats')
  .renameTable('private_attachments', 'attachments');


exports.down = knex => knex.schema
  .renameTable('messages', 'private_messages')
  .renameTable('chats', 'private_chats')
  .renameTable('attachments', 'private_attachments');

