let UserModel = require("../models/user");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const passwordHasher = require("../helpers/passwordHasher");
const jwt = require("jsonwebtoken");
const jwtHelper = require("../helpers/jwt");

let UserController = {
  setAvatar: async (req, res) => {
    const file = req.file;

    if (!file || !file.filename) {
      res.status(StatusCodes.BAD_REQUEST).json("no file provided");
      return;
    }

    if (!req.user || !req.user.id) {
      res.status(StatusCodes.UNAUTHORIZED).json("not authorized");
      return;
    }

    try {
      await AvatarModel.findOneAndUpdate(
        {
          user: req.user.id,
        },

        {
          $set: {
            fileName: file.filename,
          },
        }
      );
    } catch (error) {
      console.error(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json("could not change avatar");
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    if (
      username === undefined ||
      password === undefined ||
      username == "" ||
      password == ""
    ) {
      res.status(StatusCodes.UNAUTHORIZED).json("username or password empty");
      return;
    }

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
      res.status(StatusCodes.OK).json({
        token: token,
        username: found.username,
        id: found._id,
        scope: scope,
      });
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
    if (!username || !password) {
      res.status(StatusCodes.BAD_REQUEST).json("missing username or password");
      return;
    }

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
    let { search } = req.body;
    if (!search) {
      search = req.params.id;
    }
    try {
      let foundUser = await UserModel.findById(search)
        .select("id username images")
        .populate("images")
        .exec();
      if (!foundUser) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send(`could not find user by id ${search}`);
        return;
      }
      res.json(foundUser);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = UserController;
