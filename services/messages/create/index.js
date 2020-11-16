const Message = require('../../../repositories/message');
const createPersonalMessage = require('./personal');
const createGroupMessage = require('./group');

const { checkAttachmentFileType } = require('../../../helpers/messages');

const checkAttachment = (msgType, attachment, filename, waveform, resolution, duration, originalName) => {
  if (attachment) {
    const type = checkAttachmentFileType(msgType, attachment);
    return Message.createAttachment({ attachment, type, waveform, filename, resolution, duration, originalName });
  }
  return null;
};

module.exports = async (chatType, data, details) => {
  const { text, type, attachment, filename, waveform, resolution, duration, originalName } = data;
  const attachmentId = await checkAttachment(type, attachment, filename, waveform, resolution, duration, originalName);
  if (chatType === 'personal') {
    return createPersonalMessage({ text, type, attachment, attachmentId, waveform, resolution, duration, originalName }, details);
  }

  if (chatType === 'group') {
    return createGroupMessage({ text, type, attachment, attachmentId, waveform, resolution, duration, originalName }, details);
  }

  return {};
};
