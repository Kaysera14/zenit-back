const activateUser = require('../../db/queries/users/activateUser.js');
const checkRegCode = require('../../db/queries/users/checkRegCode');

const validate = async (req, res) => {
  try {
    const { registrationCode } = req.params;
    const user = await checkRegCode(registrationCode);
    if (!user) return res.status(401).json({ error: 'Código invalido' });

    await activateUser(user.username);
    res
      .status(200)
      .json({ status: 'ok', message: 'Usuario validado correctamente.' });
  } catch (error) {
    console.error('Error al procesar la validación del usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar la validación del usuario.',
    });
  }
};

module.exports = validate;
