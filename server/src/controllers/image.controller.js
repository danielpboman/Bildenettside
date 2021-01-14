"use strict";

let ImageModel = require("../models/image");
let UserModel = require("../models/user");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const cloudinary = require("cloudinary").v2;

let ImageController = {
  addDatesToAll: async () => {
    await ImageModel.updateMany(
      {},
      {
        $set: {
          uploaded: Date.now(),
        },
      }
    );
  },
  dislikeImage: async (req, res) => {
    let search = req.body.id;

    if (search === undefined) {
      search = req.query.id;
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

      res.status(StatusCodes.OK).json(
        await ImageModel.findById(search)
          .select(["id", "author", "likes", "uploaded", "fileName"])
          .populate([
            {
              path: "author",
              select: ["id", "username", "avatar", "admin"],
            },
            {
              path: "images.likes",
            },
          ])
          .exec()
      );
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    }
  },

  likeImage: async (req, res) => {
    let search = req.body.id;

    if (search === undefined) {
      search = req.query.id;
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

      res.status(StatusCodes.OK).json(
        await ImageModel.findById(search)
          .select(["id", "author", "likes", "uploaded"])
          .populate([
            {
              path: "author",
              select: ["id", "username", "avatar", "admin"],
            },
            {
              path: "images.likes",
            },
          ])
          .exec()
      );
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json(ReasonPhrases.BAD_REQUEST);
    }
  },
  serveImage: async (req, res) => {
    let search = req.body.id;

    if (search === undefined) {
      search = req.query.id;
    }
    if (search === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("you need to include id in json body or in url");
      return;
    }
    try {
      let found = await ImageModel.findById(search).select("fileName");
      if (!found) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send(`Could not find image by id ${search}`);
        return;
      }
      let url = cloudinary.url(found.fileName);
      res.redirect(301, url);
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
      search = req.query.id;
    }
    if (search === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json("you need to include id in json body or in url");
      return;
    }
    try {
      let found = await ImageModel.findById(search)
        .select(["id", "author", "likes", "uploaded", "fileName"])
        .populate([
          {
            path: "author",
            select: ["id", "username", "avatar", "admin"],
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
    let { offset, page, limit } = req.query;

    if (limit === undefined || limit > 50) {
      limit = 50;
    }

    let args = {
      pagination: true,
      limit: limit,
    };

    if (page === undefined && offset === undefined) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("you need to provide a page number or an offset");
      return;
    }

    if (page !== undefined) {
      args.page = page;
    } else if (offset !== undefined) {
      args.offset = offset;
    } else {
      console.log(offset, page);
      res.status(StatusCodes.BAD_REQUEST).send("offset and page are undefined");
      return;
    }

    try {
      const result = await ImageModel.paginate(
        {},
        {
          select: ["id", "likes", "author", "uploaded", "fileName"],
          ...args,
          pagination: true,
          sort: {
            uploaded: -1,
          },

          populate: [
            {
              path: "likes",
              select: "id username avatar admin",
            },
            { path: "author", select: "id username avatar admin" },
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
        uploaded: Date.now(),
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

      const response = await ImageModel.findById(newImage._id)
        .select(["id", "author", "likes", "uploaded", "fileName"])
        .populate([
          {
            path: "author",
            select: ["id", "username", "avatar", "admin"],
          },
          {
            path: "images.likes",
          },
        ])
        .exec();

      res.status(StatusCodes.OK).json(response);
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
