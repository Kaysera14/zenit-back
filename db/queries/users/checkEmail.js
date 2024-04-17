const getPool = require('../../getDB.js');

const checkEmail = async (email) => {
  const pool = await getPool();

  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [
    email,
  ]);

  return user;
};

module.exports = checkEmail;
