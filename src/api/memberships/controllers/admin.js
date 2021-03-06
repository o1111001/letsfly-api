const { responseCreator } = require('../../../helpers/responses');
const { CustomError } = require('../../../helpers/errors');

const {
  getChatIdByMembershipId,
  getChatIdByLink,
  isFreeName: isFreeNameService,
} = require('../services/helpers');

const {
  createMembership: createMembershipService,
  updateMembershipAvatar: updateMembershipAvatarService,
  updateMembershipInfo: updateMembershipInfoService,
  deleteMembership: deleteMembershipService,
} = require('../services/admin');

const {
  isChatAdmin,
} = require('../services/admin');

const getAvatar = files => (files.avatar && files.avatar.length ? files.avatar[0].path : null);

const createMembership = async req => {
  const { id: adminId } = req.locals;
  const {
    name,
    description,
    price,
    link,
    avatar,
  } = req.body;
  const chatId = await getChatIdByLink(link);
  await isChatAdmin(adminId, chatId);

  // const isFreeName = await isFreeNameService(chatId, name);
  // if (!isFreeName) {
  //   throw new CustomError('Name is already in use', 409);
  // }

  const membershipId = await createMembershipService({
    name,
    description,
    price,
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
    id: membershipId,
    avatar,
    name,
    description,
    amount,
  } = req.body;
  const { id: userId } = req.locals;
  const [{ chatId }] = await getChatIdByMembershipId(membershipId);
  await isChatAdmin(userId, chatId);
  const id = await updateMembershipInfoService(membershipId, {
    avatar,
    name,
    description,
    amount,
  });
  return responseCreator({ membershipId: id });
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
  const { id: userId } = req.locals;
  const chatId = await getChatIdByLink(link);

  await isChatAdmin(userId, chatId);
  const isFreeName = await isFreeNameService(chatId, name);
  return responseCreator({ isFreeName });
};

module.exports = {
  createMembership,
  updateMembershipAvatar,
  updateMembershipInfo,
  deleteMembership,
  checkName,
};
