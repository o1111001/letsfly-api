const Message = require('../../../repositories/message');
const createPersonalMessage = require('./personal');
const createGroupMessage = require('./group');

const { checkAttachmentFileType } = require('../../../helpers/messages');

const checkAttachment = (msgType, attachment, filename, waveform, resolution, duration) => {
  if (attachment) {
    const type = checkAttachmentFileType(msgType, attachment);
    return Message.createAttachment({ attachment, type, waveform, filename, resolution, duration });
  }
  return null;
};

module.exports = async (chatType, data, details) => {
  const { text, type, attachment, filename, waveform, resolution, duration } = data;
  const attachmentId = await checkAttachment(type, attachment, filename, waveform, resolution, duration);
  if (chatType === 'personal') {
    return createPersonalMessage({ text, type, attachment, attachmentId, waveform, resolution, duration }, details);
  }

  if (chatType === 'group') {
    return createGroupMessage({ text, type, attachment, attachmentId, waveform, resolution, duration }, details);
  }

  return {};
};
