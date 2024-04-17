const filtersToApply = require('../../db/queries/models/filtersToApply.js');

const filter = async (req, res) => {
  try {
    const models = await filtersToApply(req.query);

    res.send({
      status: 'ok',
      data: models,
    });
  } catch (error) {
    res.send({
      status: '400',
      error: error,
    });
  }
};

module.exports = filter;
