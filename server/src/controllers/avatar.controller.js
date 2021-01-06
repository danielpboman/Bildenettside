const { mongoose } = require("mongoose");
const path = require("path");

let UserModel = require("../models/user");
let AvatarModel = require("../models/avatar");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const AVATAR_PATH = require("../helpers/config").AVATAR_PATH;

let AvatarController = {
  getByUser: async (req, res) => {
    let search = req.params.id;

    if (search === undefined || search === "" || search == "") {
      res.status(StatusCodes.BAD_REQUEST).send("no id provided");
      return;
    }

    try {
      let found = await AvatarModel.findOne({
        user: search,
      })
        .select(["id", "user", "fileName"])
        .populate([
          {
            path: "user",
            select: ["id", "username"],
          },
        ]);

      if (!found) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(`could not find avatar by id ${search}`);
      }

      //return res.json(found);
      res.sendFile(found.fileName, {
        root: path.join("./", AVATAR_PATH),
      });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`could not find image by id ${search}`);
    }
  },
  getByID: async (req, res) => {
    let search = req.params.id;

    if (search === undefined || search === "" || search == "") {
      res.status(StatusCodes.BAD_REQUEST).send("no id provided");
      return;
    }

    try {
      let found = await AvatarModel.findById(search)
        .select(["id", "user", "fileName"])
        .populate([
          {
            path: "user",
            select: ["id", "username"],
          },
        ]);

      if (!found) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(`could not find image by id ${search}`);
      }

      //return res.json(found);
      res.sendFile(found.fileName, {
        root: path.join("./", AVATAR_PATH),
      });
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`could not find image by id ${search}`);
    }
  },
};

module.exports = AvatarController;
