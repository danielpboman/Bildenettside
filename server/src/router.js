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

const AvatarController = require("./controllers/avatar.controller");

const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: require("./helpers/config").IMAGE_FOLDER,
      public_id: `${Date.now() + "-" + Math.round(Math.random() * 1e9)}`,
    };
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: require("./helpers/config").AVATAR_FOLDER,
      public_id: `${Date.now() + "-" + Math.round(Math.random() * 1e9)}`,
    };
  },
});

const avatar = multer({
  storage: avatarStorage,
});
const image = multer({
  storage: imageStorage,
});

const init = (app) => {
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

  app.get("/user", async (req, res) => {
    await UserController.find(req, res);
  });

  app.get("/posts", async (req, res) => {
    await UserController.findAllImages(req, res);
  });

  app.get("/i", async (req, res) => {
    await ImageController.serveImage(req, res);
  });
  app.get("/image", async (req, res) => {
    await ImageController.getById(req, res);
  });

  app.get("/images", async (req, res) => {
    await ImageController.getAll(req, res);
  });

  app.delete("/like", jwtHelper.jwtMW, async (req, res) => {
    await ImageController.dislikeImage(req, res);
  });

  app.post("/like", jwtHelper.jwtMW, async (req, res) => {
    await ImageController.likeImage(req, res);
  });

  app.post(
    "/upload",
    [jwtHelper.jwtMW, guard.check(["user:upload"]), image.single("file")],
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
    [jwtHelper.jwtMW, guard.check(["user:upload"]), avatar.single("file")],
    async (req, res) => {
      if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).send("no file provided");
        return;
      }

      await UserController.setAvatar(req, res);
    }
  );

  app.get("/avatar", async (req, res) => {
    /*let type = req.params.type;

    if (type === "user") {
      await AvatarController.getByUser(req, res);
    } else {*/
    await AvatarController.getByID(req, res);
    //}
  });

  db.init();
};

exports.init = init;
