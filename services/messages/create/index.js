const Message = require('../../../repositories/message');
const createPersonalMessage = require('./personal');
const createGroupMessage = require('./group');

const { checkAttachmentFileType } = require('../../../helpers/messages');

const checkAttachment = (msgType, attachment) => {
  if (attachment) {
    const type = checkAttachmentFileType(msgType, attachment);
    return Message.createAttachment({ attachment, type });
  }
  return null;
};

module.exports = async (chatType, data, details) => {
  const { text, type, attachment } = data;
  const attachmentId = await checkAttachment(type, attachment);
  if (chatType === 'personal') {
    return createPersonalMessage({ text, type, attachment, attachmentId }, details);
  }

  if (chatType === 'group') {
    return createGroupMessage({ text, type, attachment, attachmentId }, details);
  }

  return {};
};
