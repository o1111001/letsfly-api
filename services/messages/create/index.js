const Message = require('../../../repositories/message');
const createPersonalMessage = require('./personal');

const { checkAttachmentFileType } = require('../../../helpers/messages');

const checkAttachment = attachment => {
  if (attachment) {
    const type = checkAttachmentFileType(attachment);
    return Message.createAttachment({ attachment, type });
  }
  return null;
};

module.exports = async (chatType, data, details) => {
  const { text, type, attachment } = data;
  const attachmentId = await checkAttachment(attachment);

  if (chatType === 'personal') {
    return createPersonalMessage({ text, type, attachment, attachmentId }, details);
  }

  return {};
};
