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

const { sendError } = require('../../helpers/responses');

const response = bio => ({
  message: `Success`,
  data: {
    bio,
  },
});

const getBio = async (req, res) => {
  try {

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
    return res.send(response({ ...bio, isBanned: user.isBanned, inBan: user.inBan }));

  } catch (error) {
    return sendError(res, error);
  }
};

const fullBioResponse = data => ({
  message: `Success`,
  data,
});

const updateFullBio = async (req, res) => {
  try {
    const { id } = req.locals;
    const { firstName, lastName, phone, username, about } = req.body;
    const errors = await updateFullBioService(id, { firstName, lastName, phone, username, about });
    return res.send(fullBioResponse(errors));
  } catch (error) {
    return sendError(res, error);
  }
};

const updateUsername = async (req, res) => {
  try {
    const { id } = req.locals;
    const { username } = req.body;
    const bio = await updateUsernameService(id, username);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

const updatePhoneNumber = async (req, res) => {
  try {
    const { id } = req.locals;
    const { phone } = req.body;
    const bio = await updatePhoneNumberService(id, phone);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

const updateFirstName = async (req, res) => {
  try {
    const { id } = req.locals;
    const { firstName } = req.body;
    const bio = await updateFirstNameService(id, firstName);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

const updateLastName = async (req, res) => {
  try {
    const { id } = req.locals;
    const { lastName } = req.body;
    const bio = await updateLastNameService(id, lastName);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

const updateAbout = async (req, res) => {
  try {
    const { id } = req.locals;
    const { about } = req.body;
    const bio = await updateAboutService(id, about);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { id } = req.locals;
    const { file: { path } } = req;
    const bio = await updateAvatarService(id, path);
    return res.send(response(bio));
  } catch (error) {
    return sendError(res, error);
  }
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
