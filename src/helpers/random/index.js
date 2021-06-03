const random = () => {
  const array = [0, 0, 0, 0, 0];
  const randomArray = array.map(() => Math.floor(Math.random() * Math.floor(9)));
  return randomArray.join('');
};

module.exports = random;
