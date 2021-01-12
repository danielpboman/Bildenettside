export default {
  getLikeCount: state => imageID => {
    let imageIndex = state.images.findIndex(i => i._id === imageID);

    if (!~imageIndex) {
      return imageIndex;
    }

    return state.images[imageIndex].likes
      ? state.images[imageIndex].likes.length
      : 0;
  },
  findImageByID: state => imageID => {
    if (!imageID) {
      return null;
    }

    let imageIndex = state.images.findIndex(i => i._id === imageID);

    if (imageIndex !== -1) {
      return state.images[imageIndex];
    }
  },
  isImageLikedByUser: state => (userID, imageID) => {
    if (!userID || !imageID) return false;
    let imageIndex = state.images.findIndex(i => i._id === imageID);

    if (!~imageIndex) {
      return false;
    }

    let image = state.images[imageIndex];

    if (!image || !image.likes) {
      return false;
    }

    if (
      image.likes.findIndex(user => {
        return user._id == userID;
      }) != -1
    ) {
      return true;
    } else if (image.likes.indexOf(userID) != -1) {
      return true;
    }

    return false;
  }
};
