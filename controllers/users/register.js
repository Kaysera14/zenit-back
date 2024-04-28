const bcrypt = require('bcrypt');
const newUser = require('../../db/queries/users/newUser');
const crypto = require('crypto');
const { sendMail, verifyEmail, generateError } = require('../../helpers');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const checkedEmail = await verifyEmail(email);
    if (!checkedEmail) {
      throw generateError('Forbidden request', 403);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const registrationCode = crypto.randomUUID();

    const HOST = process.env.HOST;

    await newUser({
      ...req.body,
      password: encryptedPassword,
      registrationCode: registrationCode,
    });

    await sendMail({
      to: email,
      subject: 'Verifica tu correo electrónico',
      HTMLPart: `Por favor, <a href='${HOST}/validate/${registrationCode}'>haz click aquí</a> para validar tu cuenta.<br/> En caso de no funcionar, por favor introduce este código manualmente: ${registrationCode}`,
    });

    res.status(201).send({
      status: 'ok',
      data: { email, username },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = register;
