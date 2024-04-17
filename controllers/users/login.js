const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkEmail = require('../../db/queries/users/checkEmail.js');
const { generateError } = require('../../helpers/');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await checkEmail(email);
    if (!userDB) {
      throw generateError('El email o la contraseña son incorrectos', 400);
    }
    if (userDB.active !== 1) {
      throw generateError('El usuario no está activo', 400);
    }
    const checkPassword = await bcrypt.compare(password, userDB.password);

    if (!checkPassword) {
      throw generateError('El email o la contraseña son incorrectos', 400);
    }

    const { username, role } = userDB;
    const tokenPayLoad = { username, email, role };
    const expiresIn = '30d';
    const token = jwt.sign(tokenPayLoad, process.env.SECRET, { expiresIn });
    res.send({ status: 'ok', data: { tokenPayLoad, expiresIn }, token });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
