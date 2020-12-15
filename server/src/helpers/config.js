let IMAGE_PATH =
  process.env.IMAGES_PATH === undefined || process.env.IMAGES_PATH == ""
    ? "./images"
    : process.env.IMAGES_PATH;

exports.IMAGE_PATH = IMAGE_PATH;
