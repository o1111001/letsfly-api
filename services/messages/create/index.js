const Message = require('../../../repositories/message');
const createPersonalMessage = require('./personal');
const createGroupMessage = require('./group');

const { checkAttachmentFileType } = require('../../../helpers/messages');

const checkAttachment = (msgType, attachment, filename, waveform, resolution) => {
  if (attachment) {
    const type = checkAttachmentFileType(msgType, attachment);
    return Message.createAttachment({ attachment, type, waveform, filename, resolution });
  }
  return null;
};

module.exports = async (chatType, data, details) => {
  const { text, type, attachment, filename, waveform, resolution } = data;
  const attachmentId = await checkAttachment(type, attachment, filename, waveform, resolution);
  if (chatType === 'personal') {
    return createPersonalMessage({ text, type, attachment, attachmentId, waveform, resolution }, details);
  }

  if (chatType === 'group') {
    return createGroupMessage({ text, type, attachment, attachmentId, waveform, resolution }, details);
  }

  return {};
};
