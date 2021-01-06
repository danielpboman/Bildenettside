const { mongoose } = require("mongoose");
const path = require("path");

let ImageModel = require("../models/image");
let UserModel = require("../models/user");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const IMAGE_PATH = require("../helpers/config").IMAGE_PATH;

let ImageController = {
  dislikeImage: async (req, res) => {
    let search = req.body.id;

    if (search === undefined) {
      search = req.params.id;
    }
    if (search === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("you need to include id in json body or in url");
      return;
    }
    let userId = req.user.id;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).send("userid not provided");
      return;
    }

    try {
      let image = await ImageModel.findById(search).exec();
      image.likes.pull({
        _id: userId,
      });

      await image.save();

      res.status(StatusCodes.OK).json(await ImageModel.findById(search).exec());
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    }
  },

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
      let image = await ImageModel.findById(search).exec();

      image.likes.addToSet({
        _id: userId,
      });

      await image.save();

      res.status(StatusCodes.OK).json(await ImageModel.findById(search).exec());
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json(ReasonPhrases.BAD_REQUEST);
    }
  },
  serveImage: async (req, res) => {
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
      let found = await ImageModel.findById(search).select("fileName");

      res.sendFile(found.fileName, {
        root: path.join("./", IMAGE_PATH),
      });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`Could not find image by id ${search}`);
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
      let found = await ImageModel.findById(search)
        .select(["id", "author", "likes"])
        .populate([
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
    let { page, limit } = req.query;

    if (limit === undefined || limit > 10) {
      limit = 10;
    }

    if (page === undefined) {
      page = 1;
    }

    try {
      const result = await ImageModel.paginate(
        {},
        {
          select: ["id", "likes", "author"],
          page: page,
          limit: limit,
          pagination: true,

          populate: [
            {
              path: "likes",
              select: "id username",
            },
            { path: "author", select: "id username" },
          ],
        }
      );

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND);
    }
  },
  create: async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(StatusCodes.BAD_REQUEST).send("no file provided");
      return;
    }

    if (!file.filename) {
      return;
    }
    try {
      const newImage = new ImageModel({
        fileName: file.filename,
        author: req.user.id,
      });
      await newImage.save();

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
