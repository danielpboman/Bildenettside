const config = {
  baseURL: "http://192.168.2.153:1337",
};

config.imagePath = function(id) {
  return `${config.baseURL}/api/i/${id}`;
};

export default config;
