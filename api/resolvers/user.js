const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
  createUser: async ({ user: { email, password } }) => {
    try {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('Email already taken');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword
      });
      const result = await newUser.save();
      return { ...result._doc, id: result.id };
    } catch (err) {
      throw err;
    }
  }
};
