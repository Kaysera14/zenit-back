const activateUser = require('../../db/queries/users/activateUser.js');
const checkRegCode = require('../../db/queries/users/checkRegCode');

const validate = async (req, res) => {
  try {
    const { registrationCode } = req.params;
    const user = await checkRegCode(registrationCode);
    if (!user) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid registration code.',
      });
      return;
    }

    await activateUser(user.username);
    res
      .status(200)
      .json({ status: 'ok', message: 'Usuario validado correctamente.' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error validating user. Please contact support.',
    });
  }
};

module.exports = validate;
