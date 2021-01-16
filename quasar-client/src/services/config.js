import { Platform } from "quasar";

const config = {
  baseURL: "https://api.bilder.danielboman.dev",
  cloudURL: "https://res.cloudinary.com/dt3er7ng3/image/upload"
};

if (Platform.is.mobile) {
  if (Platform.is.ios) {
    config.cloudURL =
      "https://res.cloudinary.com/dt3er7ng3/image/upload/q_auto,f_jp2";
  } else {
    config.cloudURL =
      "https://res.cloudinary.com/dt3er7ng3/image/upload/f_webp,q_auto";
  }
} else {
  config.cloudURL =
    "https://res.cloudinary.com/dt3er7ng3/image/upload/f_auto,q_auto";
}

config.avatarPath = function(id) {
  return `${config.baseURL}/api/avatar?id=${id}`;
};
config.imagePath = function(fileName) {
  return `${config.cloudURL}/${fileName}`;
};
export default config;
