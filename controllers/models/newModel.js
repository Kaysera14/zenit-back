const slug = require('slug');
const { createModel } = require('../../db/queries/models/createModel.js');
const jwt = require('jsonwebtoken');
const { verifyEmail, generateError } = require('../../helpers/');

const newModel = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const email = decodedToken.email;

    const checkedEmail = await verifyEmail(email);
    if (!checkedEmail) {
      throw generateError('Forbidden request', 403);
    }

    const { title, description, technologies, category1, category2 } = req.body;
    const url = slug(title);

    await createModel(
      url,
      title,
      description,
      technologies,
      category1,
      category2
    );

    res.send({
      status: 'ok',
      data: {
        slug,
        title,
        description,
        technologies,
        category1,
        category2,
      },
      message: `${title} se ha publicado con éxito.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = newModel;
