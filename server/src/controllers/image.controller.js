const { mongoose } = require("mongoose");
const path = require("path");

let ImageModel = require("../models/image");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const IMAGE_PATH =
  process.env.IMAGES_PATH === undefined ? "./images" : process.env.IMAGES_PATH;

let ImageController = {
  getById: async (req, res) => {
    const { id } = req.params;

    try {
      let found = await ImageModel.find({
        _id: id,
      });

      return res.json(found);
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`Could not find image by id ${id}`);
    }
  },
  getAll: async (req, res) => {
    let { page, limit, offset } = req.body;

    if (page === undefined) {
      page = 0;
    }

    if (limit === undefined || limit > 50) {
      limit = 50;
    }

    if (offset === undefined) {
      offset = 0;
    }

    try {
      const result = await ImageModel.paginate(
        {},
        {
          page: page,
          limit: limit,
          offset: offset,
          populate: [
            { path: "author", select: ["id", "username", "admin"] },
            { path: "likes" },
          ],
        }
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND);
    }
  },
  create: async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(StatusCodes.BAD_REQUEST).json("no file provided");
      return;
    }
    try {
      const newImage = new ImageModel({
        filePath: file.filename,
        author: req.user.id,
      });
      await newImage.save();

      res.status(StatusCodes.OK).json({
        id: newImage._id,
        author: newImage.author,
      });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
      return;
    }
  },
};

module.exports = ImageController;
