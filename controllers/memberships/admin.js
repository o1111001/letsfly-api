const { responseCreator } = require('../../helpers/responses');
const { CustomError } = require('../../helpers/errors');

const {
  getChatIdByMembershipId,
  getChatIdByLink,
  isFreeName: isFreeNameService,
} = require('../../services/memberships/helpers');

const {
  createMembership: createMembershipService,
  updateMembershipAvatar: updateMembershipAvatarService,
  updateMembershipInfo: updateMembershipInfoService,
  deleteMembership: deleteMembershipService,
} = require('../../services/memberships/admin');

const {
  isChatAdmin,
} = require('../../services/chats/group/admin');

const getAvatar = files => (files.avatar && files.avatar.length ? files.avatar[0].path : null);

const createMembership = async req => {
  const { id: adminId } = req.locals;
  console.log('sdfsdf');
  const {
    name,
    description,
    amount,
    link,
  } = req.body;
  const avatar = getAvatar(req.files);
  console.log(avatar);
  const chatId = await getChatIdByLink(link);
  await isChatAdmin(adminId, chatId);

  const isFreeName = await isFreeNameService(chatId, name);
  console.log(isFreeName);
  if (!isFreeName) {
    throw new CustomError('Name is already in use', 409);
  }

  const membershipId = await createMembershipService({
    name,
    description,
    amount,
    chatId,
    avatar,
  });
  return responseCreator({ membershipId });
};

const updateMembershipAvatar = async req => {
  const { id: userId } = req.locals;
  const {
    membershipId,
  } = req.body;
  const avatar = getAvatar(req.files);
  if (!avatar) {
    throw new CustomError('Avatar is required', 422);
  }

  const chatId = await getChatIdByMembershipId(membershipId);
  await isChatAdmin(userId, chatId);
  await updateMembershipAvatarService(membershipId, avatar);
  return responseCreator({ membershipId, avatar });
};

const updateMembershipInfo = async req => {
  const {
    membershipId,
    name,
    description,
    price,
  } = req.body;
  const { id: userId } = req.locals;
  const chatId = await getChatIdByMembershipId(membershipId);
  await isChatAdmin(userId, chatId);
  await updateMembershipInfoService(membershipId, {
    name,
    description,
    price,
  });
  return responseCreator();
};

const deleteMembership = async req => {
  const {
    membershipId,
  } = req.body;
  const { id: userId } = req.locals;
  const chatId = await getChatIdByMembershipId(membershipId);
  await isChatAdmin(userId, chatId);
  await deleteMembershipService(membershipId);
  return responseCreator();
};

const checkName = async req => {
  const {
    link,
    name,
  } = req.params;
  console.log(123);
  const { id: userId } = req.locals;
  const chatId = await getChatIdByLink(link);

  await isChatAdmin(userId, chatId);
  const isFreeName = await isFreeNameService(chatId, name);
  console.log(isFreeName);
  return responseCreator({ isFreeName });
};

module.exports = {
  createMembership,
  updateMembershipAvatar,
  updateMembershipInfo,
  deleteMembership,
  checkName,
};
