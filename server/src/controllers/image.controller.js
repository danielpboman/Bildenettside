const { mongoose } = require("mongoose");
const path = require("path");

let ImageModel = require("../models/image");
let UserModel = require("../models/user");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const IMAGE_PATH =
  process.env.IMAGES_PATH === undefined ? "./images" : process.env.IMAGES_PATH;

let ImageController = {
  likeImage: async (req, res) => {
    let search = req.body.id;

    if (search === undefined) {
      search = req.params.id;
    }
    if (search === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("you need to include id in json body or in url");
      return;
    }

    let userId = req.user.id;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json("userid not provided");
      return;
    }
    try {
      await ImageModel.findOneAndUpdate(
        {
          _id: search,
        },
        {
          $addToSet: {
            likes: {
              _id: userId,
            },
          },
        },
        {
          useFindAndModify: false,
        }
      );

      res.status(StatusCodes.OK).json(await ImageModel.findById(search).exec());
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json(ReasonPhrases.BAD_REQUEST);
    }
  },
  getById: async (req, res) => {
    let search = req.body.id;

    if (search === undefined) {
      search = req.params.id;
    }
    if (search === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("you need to include id in json body or in url");
      return;
    }
    try {
      let found = await ImageModel.findById(search).populate([
        {
          path: "author",
          select: ["id", "username"],
        },
        {
          path: "images.likes",
        },
      ]);

      return res.json(found);
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`Could not find image by id ${search}`);
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
            {
              path: "images.likes.author",
              select: ["id", "username", "admin"],
            },
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

    if (!file.filename) {
      console.log(file);
      return;
    }
    try {
      const newImage = new ImageModel({
        filePath: file.filename,
        author: req.user.id,
      });
      await newImage.save();
      /*
      const user = await UserModel.findById(req.user.id)
        .select(["id", "username", "admin", "images"])
        .exec();

      user.images.addToSet(newImage);
      await user.save();*/

      await UserModel.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          $addToSet: {
            images: {
              _id: newImage._id,
            },
          },
        }
      );

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
