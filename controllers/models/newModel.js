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
const modelVideos = require('../../db/queries/models/modelVideos.js');

const newModel = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const email = decodedToken.email;
    const checkedEmail = await verifyEmail(email);

    if (!checkedEmail) {
      throw generateError('Forbidden request', 403);
    }

    const { title, description, technologies, category1, category2, videos } =
      req.body;
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

    let videoLinks = videos.split(',');

    for (let video of videoLinks) {
      const cover = 0;

      let videoId = video.trim().split('v=')[1];

      if (videoId) {
        let ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }

        let embedUrl = `https://www.youtube.com/embed/${videoId}`;
        await modelVideos(url, embedUrl, cover);
      } else {
        console.error(`Invalid video URL: ${video}`);
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
