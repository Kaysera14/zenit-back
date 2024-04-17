const fs = require('fs/promises');

const generateError = (msg, statusCode) => {
  const error = new Error(msg);

  error.statusCode = statusCode;

  throw error;
};

module.exports = generateError;
