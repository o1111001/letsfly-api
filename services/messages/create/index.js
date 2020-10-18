const Message = require('../../../repositories/message');
const createPersonalMessage = require('./personal');
const createGroupMessage = require('./group');

const { checkAttachmentFileType } = require('../../../helpers/messages');

const checkAttachment = (msgType, attachment, waveform) => {
  if (attachment) {
    const type = checkAttachmentFileType(msgType, attachment);
    return Message.createAttachment({ attachment, type, waveform });
  }
  return null;
};

module.exports = async (chatType, data, details) => {
  const { text, type, attachment, waveform } = data;
  // console.log({details});
  const attachmentId = await checkAttachment(type, attachment, waveform);
  if (chatType === 'personal') {
    return createPersonalMessage({ text, type, attachment, attachmentId, waveform }, details);
  }

  if (chatType === 'group') {
    return createGroupMessage({ text, type, attachment, attachmentId, waveform }, details);
  }

  return {};
};
