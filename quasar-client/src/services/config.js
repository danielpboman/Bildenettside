const config = {
  baseURL: process.env.API_URL || "http://192.168.0.127:1337",

  imagePath: function(id) {
    return `${config.baseURL}/api/i?id=${id}`;
  },
  avatarPath: function(id) {
    return `${config.baseURL}/api/avatar/id/?id=${id}`;
  }
};

export default config;
