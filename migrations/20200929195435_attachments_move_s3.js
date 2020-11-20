exports.up = knex => knex.schema.alterTable('attachments', t => {
  t.renameColumn('path', 'key');
  t.string('originalName');
  t.string('waveform', 1000);

});

exports.down = knex => knex.schema.alterTable('attachments', t => {
  t.renameColumn('key', 'path');
  t.dropColumn('originalName');
  t.dropColumn('waveform');
});
