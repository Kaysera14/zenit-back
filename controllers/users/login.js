const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkEmail = require('../../db/queries/users/checkEmail.js');
const { verifyEmail } = require('../../helpers/');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const checkedEmail = await verifyEmail(email);
    if (!checkedEmail) {
      res.send({
        status: 'error',
        message: 'Only allowed emails are allowed to login.',
      });
    }

    const userDB = await checkEmail(email);
    if (!userDB) {
      res.send({
        status: 'error',
        message:
          'This email is not registered. Please sign up if you are on the allowed list.',
      });
    }
    if (userDB.active !== 1) {
      res.send({
        status: 'error',
        message:
          'User is not active. Please check your email to activate your account.',
      });
    }
    const checkPassword = await bcrypt.compare(password, userDB.password);

    if (!checkPassword) {
      res.send({
        status: 'error',
        message: 'Password is incorrect. Please try again.',
      });
    }

    const { username } = userDB;
    const tokenPayLoad = { username, email };
    const expiresIn = '30d';
    const token = jwt.sign(tokenPayLoad, process.env.SECRET, { expiresIn });
    res.send({ status: 'ok', data: { tokenPayLoad, expiresIn }, token });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
