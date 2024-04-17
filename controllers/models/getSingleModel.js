const { getOneModel } = require('../../db/queries/models/getOneModel.js');

const getSingleModel = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const model = await getOneModel(slug);
    res.send({
      status: 'ok',
      data: model[0],
      images: model[1],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getSingleModel;
