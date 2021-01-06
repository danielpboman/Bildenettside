const db = require("./db");
const UserController = require("./controllers/user.controller");
const ImageController = require("./controllers/image.controller");
const jwtHelper = require("./helpers/jwt");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const guard = require("express-jwt-permissions")({
  requestProperty: "user",
  permissionsProperty: "scope",
});

const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const mime = require("mime");
const fs = require("fs");
const IMAGE_PATH = require("./helpers/config").IMAGE_PATH;
const AVATAR_PATH = require("./helpers/config").AVATAR_PATH;
const AvatarController = require("./controllers/avatar.controller");

const init = (app) => {
  console.log("IMAGE_PATH: " + IMAGE_PATH);
  console.log("AVATAR_PATH: " + AVATAR_PATH);
  if (!fs.existsSync(IMAGE_PATH)) {
    fs.mkdirSync(IMAGE_PATH);
  }
  if (!fs.existsSync(AVATAR_PATH)) {
    fs.mkdirSync(AVATAR_PATH);
  }

  app.use(bodyParser.json());
  app.use(cookieParser());

  app.post("/register", async (req, res) => {
    if (!req.body) {
      res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
      return;
    }
    await UserController.create(req, res);
  });

  app.post("/login", async (req, res) => {
    if (!req.body) {
      res.status(StatusCodes.BAD_REQUEST).send("no login info included");
      return;
    }

    await UserController.login(req, res);
  });

  app.get("/user/:id", async (req, res) => {
    await UserController.find(req, res);
  });

  app.get("/posts/:id", async (req, res) => {
    await UserController.findAllImages(req, res);
  });

  app.get("/i/:id", async (req, res) => {
    await ImageController.serveImage(req, res);
  });
  app.get("/image/:id", async (req, res) => {
    await ImageController.getById(req, res);
  });

  app.get("/images", async (req, res) => {
    await ImageController.getAll(req, res);
  });

  app.delete("/like/:id", jwtHelper.jwtMW, async (req, res) => {
    await ImageController.dislikeImage(req, res);
  });

  app.post("/like/:id", jwtHelper.jwtMW, async (req, res) => {
    await ImageController.likeImage(req, res);
  });

  const storage = multer({
    fileFilter: (req, file, cb) => {
      let extname = file.originalname
        .toLowerCase()
        .match(/.(jpeg|jpg|png|gif)$/);
      let mimetype = file.mimetype.match(/(jpeg|jpg|png|gif)$/);

      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        console.log(req.baseUrl);
        if (req.baseUrl == "/avatar") {
          cb(null, AVATAR_PATH);
          return;
        }
        cb(null, IMAGE_PATH);
      },

      filename: async (req, file, cb) => {
        try {
          const type = mime.getExtension(file.mimetype);

          cb(
            null,
            `${
              Date.now() +
              "-" +
              Math.round(Math.random() * 1e9) +
              "." +
              (type && type != "" ? type : "undefined")
            }`
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
  });

  app.post(
    "/upload",
    [jwtHelper.jwtMW, guard.check(["user:upload"]), storage.single("file")],
    async (req, res) => {
      if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).json("no file provided");
        return;
      }

      await ImageController.create(req, res);
    }
  );

  app.post(
    "/avatar",
    [jwtHelper.jwtMW, guard.check(["user:upload"], storage.single("file"))],
    async (req, res) => {
      if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).send("no file provided");
        return;
      }

      await UserController.setAvatar(req, res);
    }
  );

  app.get("/avatar/:id", async (req, res) => {
    await AvatarController.getByID(req, res);
  });

  app.get("/avatar", async (req, res) => {
    await AvatarController.getByUser(req, res);
  });

  db.init();
};

exports.init = init;
