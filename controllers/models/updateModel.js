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

    const { title } = req.body;
    const oldTitle = req.params.slug;
    const url = slug(title);

    const newData = {
      ...(req.body.model_id && { model_id: req.body.model_id }),
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.technologies && { technologies: req.body.technologies }),
      ...(req.body.category1 && {
        category1: req.body.category1,
      }),
      ...(req.body.category2 && { category2: req.body.category2 }),
    };

    const rowsAffected = await changeModel(
      url,
      oldTitle,
      newData.model_id,
      newData.title,
      newData.description,
      newData.technologies,
      newData.category1,
      newData.category2
    );

    if (rowsAffected === 0) {
      return res
        .status(400)
        .json({ error: 'No hay ningún dato para actualizar' });
    }

    res.status(200).send({
      status: 'ok',
      data: { newData },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateModel;
