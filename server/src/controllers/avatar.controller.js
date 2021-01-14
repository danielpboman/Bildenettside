let AvatarModel = require("../models/avatar");

const { StatusCodes } = require("http-status-codes");

const cloudinary = require("cloudinary").v2;

let AvatarController = {
  getByUser: async (req, res) => {
    let search = req.query.id;

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
      let url = cloudinary.url(found.fileName);

      res.redirect(301, url);
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`could not find image by id ${search}`);
    }
  },
  getByID: async (req, res) => {
    let search = req.query.id;

    if (search === undefined || search === "" || search == "") {
      res.status(StatusCodes.BAD_REQUEST).send("no id provided");
      return;
    }

    try {
      let found = await AvatarModel.findById(search).select("fileName");

      if (!found) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(`could not find image by id ${search}`);
      }

      let url = cloudinary.url(found.fileName);
      res.redirect(301, url);
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`could not find image by id ${search}`);
    }
  },
};

module.exports = AvatarController;
