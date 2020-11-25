exports.up = knex => knex.schema
  .alterTable('users', t => {
    t.index('email');
  })
  .alterTable('tokens', t => {
    t.index('userId');
    t.index('access');
    t.index('refresh');
  })
  .alterTable('withdrawals', t => {
    t.index('userId');
  })
  .alterTable('messages_is_read', t => {
    t.index(['userId', 'messageId']);
  })
  .alterTable('messages', t => {
    t.index('senderId');
    t.index('attachmentId');
  })
  .alterTable('attachments', t => {
    t.index('key');
  })
  .alterTable('chats', t => {
    t.index('name');
    t.index('link');
  })
  .alterTable('chats_memberships', t => {
    t.index('name');
    t.index('chatId');
  })
  .alterTable('login_codes', t => {
    t.index('userId');
  })
  .alterTable('contacts', t => {
    t.index(['userId', 'contact']);
  })
;

exports.down = knex => knex.schema
  .alterTable('users', t => {
    t.dropIndex('email');
  })
  .alterTable('tokens', t => {
    t.dropIndex('userId');
    t.dropIndex('access');
    t.dropIndex('refresh');
  })
  .alterTable('withdrawals', t => {
    t.dropIndex('userId');
  })
  .alterTable('messages_is_read', t => {
    t.dropIndex(['userId', 'messageId']);
  })
  .alterTable('messages', t => {
    t.dropIndex('senderId');
    t.dropIndex('attachmentId');
  })
  .alterTable('attachments', t => {
    t.dropIndex('key');
  })
  .alterTable('chats', t => {
    t.dropIndex('name');
    t.dropIndex('link');
  })
  .alterTable('chats_memberships', t => {
    t.dropIndex('name');
    t.dropIndex('chatId');
  })
  .alterTable('login_codes', t => {
    t.dropIndex('userId');
  })
  .alterTable('contacts', t => {
    t.dropIndex(['userId', 'contact']);
  })
;
