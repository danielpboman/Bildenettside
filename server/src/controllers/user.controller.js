const { mongoose } = require("mongoose");
let UserModel = require("../models/user");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const passwordHasher = require("../helpers/passwordHasher");
const jwt = require("jsonwebtoken");
const jwtHelper = require("../helpers/jwt");

let UserController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      let found = await UserModel.findOne({
        username: username.toLowerCase(),
      }).exec();

      if (!found || found.length == 0) {
        console.log(`user ${username} not found.`);
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json("user not found or password invalid");
        return;
      }

      const ok = await passwordHasher.comparePassword(password, found.password);

      if (!ok) {
        console.log("passwords dont match");
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json("user not found or password invalid");
        return;
      }

      let scope = ["user:upload"];

      if (found.admin) {
        scope.push("user:admin");
      }

      let token = jwt.sign(
        {
          id: found._id,
          username: found.username.toLowerCase(),
          scope: scope,
        },
        jwtHelper.secret,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("identity", token);
      res.status(StatusCodes.OK).json("logged in successfully");
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json("user not found or password invalid");
    }
  },
  find: async (req, res) => {
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
      let found = await UserModel.findOne(
        {
          _id: search,
        },
        "id username admin images"
      )
        .populate({
          path: "images",
        })
        .exec();
      res.json(found);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.NOT_FOUND).json("user not found");
    }
  },
  create: async (req, res) => {
    const { username, password } = req.body;

    try {
      const found = await UserModel.find({
        username: username.toLowerCase(),
      }).exec();
      if (found && found.length != 0) {
        res.status(StatusCodes.BAD_REQUEST).json("user already exists");

        return;
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
      console.error(error);
      return;
    }

    const hashedPassword = await passwordHasher.hashPassword(password);

    const user = new UserModel({
      username: username.toLowerCase(),
      password: hashedPassword,
      admin: false,
    });

    await user.save();

    res.status(StatusCodes.OK).json({ id: user._id });
  },

  findAllImages: async (req, res) => {
    const { username } = req.body;
    try {
      let foundUser = await UserModel.findOne({
        name: username.toLowerCase(),
      })
        .populate("images")
        .exec();
      if (!foundUser) {
        console.error("user not found");
        return;
      }
      res.json(foundUser);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = UserController;
