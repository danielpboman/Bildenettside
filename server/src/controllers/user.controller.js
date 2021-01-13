let UserModel = require("../models/user");
let AvatarModel = require("../models/avatar");

const passwordHasher = require("../helpers/passwordHasher");
const jwtHelper = require("../helpers/jwt");

const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const cloudinary = require("cloudinary").v2;

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
      let found = await AvatarModel.findOne({
        user: req.user.id,
      }).exec();

      console.log(found);

      if (!found) {
        found = new AvatarModel({
          fileName: file.filename,
          user: req.user.id,
        });
        await found.save();

        let user = await UserModel.findById(req.user.id);

        if (!user) {
          throw "could not find user??";
        }

        user.avatar = found.id;
        await user.save();
      } else {
        await cloudinary.destroy(found.fileName);

        found.fileName = file.filename;
        await found.save();
      }

      res.status(StatusCodes.OK).send("updated avatar");
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
          avatar: found.avatar,
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
        avatar: found.avatar,
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
      search = req.query.id;
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
        "id username admin images avatar"
      )
        .populate([
          {
            path: "avatar",
            select: ["id", "user"],
          },
        ])
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

    const avatar = new AvatarModel({
      user: user._id,
      fileName: "default.png",
    });

    user.avatar = avatar._id;

    await avatar.save();
    await user.save();

    res.status(StatusCodes.OK).json({ id: user._id });
  },

  findAllImages: async (req, res) => {
    let { search } = req.body;
    if (!search) {
      search = req.query.id;
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
