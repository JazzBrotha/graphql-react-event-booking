const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect');
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      'somesecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { userId: user.id, token, tokenExpiration: 1 };
  }
};
