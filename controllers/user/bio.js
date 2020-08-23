const {
  bio: {
    getBio: getBioService,
    updateUsername: updateUsernameService,
    updatePhoneNumber: updatePhoneNumberService,
    updateFirstName: updateFirstNameService,
    updateLastName: updateLastNameService,
    updateAbout: updateAboutService,
    updateAvatar: updateAvatarService,
    updateFullBio: updateFullBioService,
  },
  ban: {
    checkBan: checkBanService,
  },
} = require('../../services/user');

const response = bio => ({
  message: `Success`,
  data: {
    bio,
  },
});

const getBio = async req => {
  const user = {
    id: req.params.id,
    isBanned: false,
    inBan: false,
  };

  const me = req.locals.id;
  if (user.id === 'me') {
    user.id = me;
  } else {
    const data = await checkBanService(me, user.id);
    user.isBanned = data.isBanned;
    user.inBan = data.inBan;
  }
  const bio = await getBioService(user.id, me);
  return response({ ...bio, isBanned: user.isBanned, inBan: user.inBan });
};

const fullBioResponse = data => ({
  message: `Success`,
  data,
});

const updateFullBio = async req => {
  const { id } = req.locals;
  const { firstName, lastName, phone, username, about } = req.body;
  const errors = await updateFullBioService(id, { firstName, lastName, phone, username, about });
  return fullBioResponse(errors);
};

const updateUsername = async req => {
  const { id } = req.locals;
  const { username } = req.body;
  const bio = await updateUsernameService(id, username);
  return response(bio);
};

const updatePhoneNumber = async req => {
  const { id } = req.locals;
  const { phone } = req.body;
  const bio = await updatePhoneNumberService(id, phone);
  return response(bio);
};

const updateFirstName = async req => {
  const { id } = req.locals;
  const { firstName } = req.body;
  const bio = await updateFirstNameService(id, firstName);
  return response(bio);
};

const updateLastName = async req => {
  const { id } = req.locals;
  const { lastName } = req.body;
  const bio = await updateLastNameService(id, lastName);
  return response(bio);
};

const updateAbout = async req => {
  const { id } = req.locals;
  const { about } = req.body;
  const bio = await updateAboutService(id, about);
  return response(bio);
};

const updateAvatar = async req => {
  const { id } = req.locals;
  const { file: { path } } = req;
  const bio = await updateAvatarService(id, path);
  return response(bio);
};

module.exports = {
  getBio,
  updateUsername,
  updatePhoneNumber,
  updateFirstName,
  updateLastName,
  updateAbout,
  updateAvatar,
  updateFullBio,
};
