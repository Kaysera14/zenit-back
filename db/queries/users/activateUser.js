const getPool = require('../../getDB.js');

const activateUser = async (username) => {
  const pool = await getPool();

  try {
    const [user] = await pool.query(
      'UPDATE users SET active = 1 WHERE username = ?',
      [username]
    );

    return user;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

module.exports = activateUser;
