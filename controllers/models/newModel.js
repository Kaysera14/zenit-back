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
    const { images } = req.files;
    const url = slug(title);

    await createModel(
      url,
      title,
      description,
      technologies,
      category1,
      category2
    );

    // Procesado de imagenes
    for (let index = 0; index < images.length; index++) {
      let cover;
      const uuid = randomUUID();
      const newName = `${url}__${uuid}.webp`;
      const directory = path.join(__dirname, '..', '..', 'uploads');
      await createPathIfNotExists(directory);
      const models = path.join(directory, 'models');
      await createPathIfNotExists(models);
      const imgUrl = `/uploads/models/${newName}`;

      await sharp(images[index].data)
        .toFormat('webp')
        .webp({ effort: 6, quality: 80 })
        .toFile(path.join(models, newName), (err) => {
          if (err) {
            console.error(err);
          }
        });

      if (index === 0) {
        cover = 1;
        await modelImages(url, imgUrl, cover);
      } else {
        cover = 0;
        await modelImages(url, imgUrl, cover);
      }
    }

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
