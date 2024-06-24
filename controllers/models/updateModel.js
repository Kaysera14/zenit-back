const { changeModel } = require('../../db/queries/models/changeModel.js');
const slug = require('slug');
const jwt = require('jsonwebtoken');
const { verifyEmail, generateError } = require('../../helpers');

const updateModel = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const email = decodedToken.email;

    const checkedEmail = await verifyEmail(email);
    if (!checkedEmail) {
      throw generateError('Forbidden request', 403);
    }

    const { model_id, title, description, technologies, category1, category2 } =
      req.body;
    const oldTitle = req.params.slug;
    const url = slug(title);

    const rowsAffected = await changeModel(
      url,
      oldTitle,
      model_id,
      title,
      description,
      technologies,
      category1,
      category2
    );

    if (rowsAffected === 0) {
      return res
        .status(400)
        .json({ error: 'No hay ningún dato para actualizar' });
    }

    res.status(200).send({
      status: 'ok',
      message: 'Modelo actualizado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateModel;
