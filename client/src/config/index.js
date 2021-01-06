const config = {
  baseURL: "http://192.168.0.127:1337",

  imagesPerPage: 15,
};

config.imagePath = function(id) {
  return `${config.baseURL}/api/i/${id}`;
};

export default config;
