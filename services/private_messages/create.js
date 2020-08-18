const Message = require('../../repositories/private_messages/message');
const Chat = require('../../repositories/chats');

const UserRepo = require('../../repositories/user/bio');
const path = require('path');

module.exports = async (chatType, senderId, receiverId, text, type, attachment) => {
  if (chatType === 'personal') {
    const chat = await Chat.checkPersonalChat({ senderId, receiverId });
    if (!chat.chatId) {
      const createdChat = await Chat.create({ type: 'personal' });
      chat.chatId = createdChat.id;
      await Promise.all([
        Chat.join({ chatId: chat.chatId, userId: senderId }),
        Chat.join({ chatId: chat.chatId, userId: receiverId }),
      ]);
    }
    let attachmentId = null;
    if (attachment) {
      let attachmentType;
      const ext = path.extname(attachment);
      if (type === 'audio') attachmentType = 'audio_message';
      else if (ext === '.mp4') attachmentType = 'video';
      else if (ext === '.mp3') attachmentType = 'audio';
      else if (['.png', '.jpg', '.jpeg'].includes(ext)) attachmentType = 'photo';
      else attachmentType = 'another';
      const { id } = await Message.createAttachment({ attachment, type: attachmentType });
      attachmentId = id;
    }

    const { chatId, user1, user2 } = chat;
    const newMessage = await Message.create({ chatId, senderId, text, type, attachment, attachmentId });
    // const user = new UserRepo(senderId);
    // const { username, firstName, lastName, email } = await user.get(receiverId);
    // const { count } = await message.unReadMessagesInChat(chatId);
    const count = 0;
    return { ...newMessage, user1, user2, count };


  }




  // let attachmentId = null;
  // if (attachment) {
  //   let attachmentType;
  //   const ext = path.extname(attachment);
  //   if (type === 'audio') attachmentType = 'audio_message';
  //   else if (ext === '.mp4') attachmentType = 'video';
  //   else if (ext === '.mp3') attachmentType = 'audio';
  //   else if (['.png', '.jpg', '.jpeg'].includes(ext)) attachmentType = 'photo';
  //   else attachmentType = 'another';
  //   const { id } = await message.createAttachment(attachmentType);
  //   attachmentId = id;
  // }

  // const { id: chatId, user1, user2 } = chat;
  // const newMessage = await message.create(chatId, attachmentId);
  // const user = new UserRepo(senderId);
  // const { username, firstName, lastName, email } = await user.get(receiverId);
  // const { count } = await message.unReadMessagesInChat(chatId);
  return {};
  // return { ...newMessage, user1, user2, username, firstName, lastName, email, count };
};
