const { bio: BioRepo } = require('../../repositories');

const getBio = async id => {
  const user = new BioRepo(id);
  const bio = await user.get(id);
  return bio;
};

const updateUsername = async (id, username) => {
  try {
    const user = new BioRepo(id);
    const updatedUser = await user.updateUsername(username);
    return updatedUser[0];
  } catch (error) {
    if (error.code === '23505') {
      throw 'Username is not available';
    }
    throw error;
  }
};

const updatePhoneNumber = async (id, phone) => {
  try {
    const user = new BioRepo(id);
    const updatedUser = await user.updatePhoneNumber(phone);
    return updatedUser[0];
  } catch (error) {
    if (error.code === '23505') {
      throw 'Phone number is not available';
    }
    throw error;
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

module.exports = {
  getBio,
  updateUsername,
  updatePhoneNumber,
  updateFirstName,
  updateLastName,
  updateAbout,
};
