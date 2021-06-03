const Message = require('../../repositories');
const Chat = require('../../../chats/repositories');
const PersonalChat = require('../../../chats/repositories/personal');
const UserRepo = require('../../../user/repositories/bio');
const User = new UserRepo();

const {
  broadcastToRoom,
} = require('../../../../realtime/broadcast');

module.exports = async (data, details) => {
  const { text, type, attachment, attachmentId, waveform, resolution, duration, originalName } = data;
  const { senderId, receiverId } = details;

  let { chatMembershipId, chatId } = await PersonalChat.findIdOfPersonalChat({ senderId, receiverId });
  if (!chatId || !chatMembershipId) {
    ({ chatMembershipId, chatId } = await Chat.create({ type: 'personal' }, [senderId, receiverId]));
  }
  const createdMessage = await Message.create({ chatId, senderId, text, type, attachmentId, membershipsList: [chatMembershipId] });
  const [user1, user2] = await Promise.all([
    User.getUser({ id: receiverId, me: senderId }),
    User.getUser({ id: senderId, me: receiverId }),
  ]);

  const message = {
    ...createdMessage,
    attachment,
    chatType: 'personal',
    waveform,
    resolution,
    duration,
    originalName,
  };

  broadcastToRoom(receiverId, 'message', { ...message, opponent: user2 });
  broadcastToRoom(senderId, 'message', { ...message, opponent: user1 });
  return { ...createdMessage, user1, user2, chatType: 'personal' };
};
