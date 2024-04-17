const { getAllModels } = require('../../db/queries/models/getAllModels.js');

const getModels = async (req, res, next) => {
  try {
    const models = await getAllModels();
    res.send({
      status: 'ok',
      data: models,
    });
  } catch (error) {
    res.send({
      error: '400',
      message: 'No encontrado',
    });
  }
};

module.exports = getModels;
