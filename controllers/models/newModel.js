const fs = require('fs');
const slug = require('slug');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const path = require('path');
const { randomUUID } = require('crypto');
const { createModel } = require('../../db/queries/models/createModel.js');
const {
  verifyEmail,
  generateError,
  createPathIfNotExists,
} = require('../../helpers/');
const modelImages = require('../../db/queries/models/modelImages.js');

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
    console.log(req.body);
    const url = slug(title);

    await createModel(
      url,
      title,
      description,
      technologies,
      category1,
      category2
    );

    /* // Procesado de imagenes
    const array = Object.values(req.files).slice();

    for (let index = 0; index < array.length; index++) {
      let cover;
      const uuid = randomUUID();
      const directory = path.join(__dirname, '..', '..', 'uploads');
      await createPathIfNotExists(directory);
      const models = path.join(directory, 'models');
      await createPathIfNotExists(models);
      const newName = `${url}__${uuid}.webp`;
      const imgUrl = `/uploads/models/${newName}`;

      if (req.files && array[index]) {
        if (array[index].mimetype.startsWith('image/')) {
          await sharp(array[index].data)
            .toFormat('webp')
            .webp({ effort: 6, quality: 80 })
            .toFile(path.join(models, newName), (err) => {
              if (err) {
                console.error(err);
              }
            });
        } else {
          res.send({
            status: 'error',
            message: 'El archivo no es una imagen',
          });
        }
      }

      if (index === 0) {
        cover = 1;
        await modelImages(url, imgUrl, cover);
      } else {
        cover = 0;
        await modelImages(url, imgUrl, cover);
      }
    } */

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
