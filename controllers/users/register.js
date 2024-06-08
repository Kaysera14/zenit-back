const bcrypt = require('bcrypt');
const newUser = require('../../db/queries/users/newUser');
const crypto = require('crypto');
const { sendMail, verifyEmail, generateError } = require('../../helpers');

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const checkedEmail = await verifyEmail(email);
    if (!checkedEmail) {
      res.send({
        status: 'error',
        message: 'Only allowed emails are allowed to register.',
      });
      throw generateError('Forbidden request', 400);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const registrationCode = crypto.randomUUID();

    const FRONT = process.env.FRONT;

    await newUser({
      ...req.body,
      password: encryptedPassword,
      registrationCode: registrationCode,
    });

    await sendMail({
      to: email,
      subject: `Verifica tu correo electrónico ${username}`,
      HTMLPart: `Por favor, <a href='${FRONT}/admin/validate?registrationCode=${registrationCode}'>haz click aquí</a> para validar tu cuenta.<br/> En caso de no funcionar, por favor introduce este código manualmente: ${registrationCode}`,
    });
    res.status(201).send({
      status: 'ok',
      message:
        'Usuario registrado correctamente. Por favor, revisa tu correo electrónico para validar tu cuenta.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = register;
