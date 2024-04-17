const { getOneModel } = require('../../db/queries/models/getOneModel.js');

const getSingleModel = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const rentings = await getOneModel(slug);
    res.send({
      status: 'ok',
      data: rentings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getSingleModel;
