const { bio: BioRepo } = require('../../repositories');
const { CustomError } = require('../../helpers/errors');
const {
  contacts: ContactsRepo,
} = require('../../repositories/contacts');
const getBio = async (id, me) => {
  const user = new BioRepo(id);
  let bio;
  console.log({id, me});
  if (+id === +me) {
    bio = await user.get(me);
    console.log(bio);
  } else {
    bio = await user.get(me);
    bio.balance = undefined;
    bio.isAdmin = undefined;
    bio.waitWithdraw = undefined;
    if (bio.contact) {
      const { displayedFirstName, displayedLastName } = await user.getUser({ id, me });
      bio.displayedFirstName = displayedFirstName;
      bio.displayedLastName = displayedLastName;
    }
  }
  return bio;
};

const updateFullBio = async (id, { firstName, lastName, phone, username, about }) => {
  const user = new BioRepo(id);
  const errors = [];
  const checkUsername = await user.checkUsername(username);
  if (checkUsername.length) errors.push('username');
  const checkPhone = await user.checkPhone(phone);
  if (checkPhone.length) errors.push('phone');
  if (errors.length) return errors;
  await user.updateFullBio({ firstName, lastName, phone, username, about });
  return errors;
};

const updateUsername = async (id, username) => {
  try {
    const user = new BioRepo(id);
    const updatedUser = await user.updateUsername(username);
    return updatedUser[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new CustomError('Username is not available', 409);
    }
    throw new CustomError('Internal server error', 500);
  }
};

const updatePhoneNumber = async (id, phone) => {
  try {
    const user = new BioRepo(id);
    const updatedUser = await user.updatePhoneNumber(phone);
    return updatedUser[0];
  } catch (error) {
    if (error.code === '23505') {
      throw new CustomError('Phone number is not available', 409);
    }
    throw new CustomError('Internal server error', 500);
  }
};

const updateFirstName = async (id, firstName) => {
  const user = new BioRepo(id);
  const updatedUser = await user.updateFirstName(firstName);
  return updatedUser[0];
};

const updateLastName = async (id, lastName) => {
  const user = new BioRepo(id);
  const updatedUser = await user.updateLastName(lastName);
  return updatedUser[0];
};

const updateAbout = async (id, about) => {
  const user = new BioRepo(id);
  const updatedUser = await user.updateAbout(about);
  return updatedUser[0];
};

const updateAvatar = async (id, key) => {
  const user = new BioRepo(id);
  const updatedUser = await user.updateAvatar(key);
  return updatedUser[0];
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
