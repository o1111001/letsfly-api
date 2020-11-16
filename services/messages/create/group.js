const Message = require('../../../repositories/message');
const Chat = require('../../../repositories/chats');
const MembershipsAdmin = require('../../../repositories/memberships/admin');

const {
  broadcastToSetOfRooms,
} = require('../../../realtime/broadcast');

module.exports = async (data, details) => {
  const { text, type, attachment, attachmentId, waveform, resolution, duration, originalName } = data;
  const { senderId, chatId, membershipsList } = details;
  const message = await Message.create({ chatId, senderId, text, type, attachment, attachmentId, membershipsList });
  const chat = await Chat.get(chatId);
  const users = await MembershipsAdmin.getMembers(membershipsList);
  const sendMessage = {
    ...message,
    opponent: chat,
    chatType: chat.type,
    waveform,
    resolution,
    duration,
    originalName,
  };
  broadcastToSetOfRooms([...users, senderId], 'message', sendMessage);

  return;
};
