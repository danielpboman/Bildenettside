const bcrypt = require("bcryptjs");

const cost = 14;

exports.hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, cost);
    return hashedPassword;
  } catch (error) {
    console.error(error);
    return null;
  }
};
exports.comparePassword = async (password, hashedPassword) => {
  try {
    const res = bcrypt.compareSync(password, hashedPassword);

    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
};
