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
    const url = slug(title);

    const HOST =
      'http://' +
      (process.env.HOST || 'localhost') +
      ':' +
      (process.env.PORT || 3000);

    await createModel(
      url,
      title,
      description,
      technologies,
      category1,
      category2
    );

    // Procesado de imagenes
    const array = [
      req.files.image1,
      req.files.image2,
      req.files.image3,
      req.files.image4,
    ];

    for (let index = 0; index < array.length; index++) {
      let cover;
      const uuid = randomUUID();
      const directory = path.join(__dirname, '..', '..', 'uploads', 'models');
      await createPathIfNotExists(directory);
      const imageName = array[index].name;
      const ext = path.extname(imageName).toLowerCase();
      const newName = `${url}__${uuid}${ext}`;
      const imgUrl = `${HOST}/uploads/models/${newName}`;

      if (req.files && array[index]) {
        await sharp(array[index].data)
          .webp({ effort: 6 })
          .toFile(path.join(directory, newName), (err) => {
            if (err) {
              console.error(err);
            }
          });
      }
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
