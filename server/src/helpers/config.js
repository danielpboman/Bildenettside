let IMAGE_PATH =
  process.env.IMAGES_PATH === undefined || process.env.IMAGES_PATH == ""
    ? "./images"
    : process.env.IMAGES_PATH;
let AVATAR_PATH =
  process.env.AVATAR_PATH === undefined || process.env.AVATAR_PATH == ""
    ? "./avatars"
    : process.env.AVATAR_PATH;

exports.AVATAR_PATH = AVATAR_PATH;
exports.IMAGE_PATH = IMAGE_PATH;
