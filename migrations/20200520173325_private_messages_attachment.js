exports.up = knex => knex.schema.alterTable('private_messages', t => {
  t.foreign('attachmentId').references('private_attachments.id');
});

exports.down = knex => knex.schema.alterTable('private_messages', t => {
  t.dropForeign('attachmentId');
});


