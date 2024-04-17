const {
  deleteModelSlug,
} = require('../../db/queries/models/deleteModelSlug.js');
const jwt = require('jsonwebtoken');
const { verifyEmail, generateError } = require('../../helpers');

const deleteModel = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const email = decodedToken.email;

    const checkedEmail = await verifyEmail(email);
    if (!checkedEmail) {
      throw generateError('Forbidden request', 403);
    }

    const slug = req.params.slug;

    await deleteModelSlug(slug);

    res.send({
      status: 'ok',
      message: `${slug} has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteModel;
