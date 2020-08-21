exports.up = knex => knex.schema
  .dropTable('private_chats');


exports.down = knex => knex.schema
  .renameTable('messages', 'private_messages')
  .renameTable('attachments', 'private_attachments');

