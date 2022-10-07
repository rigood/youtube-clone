import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Youtube";
  res.locals.moment = require("moment");
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "먼저 로그인 해주세요.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "권한이 없습니다.");
    return res.redirect("/");
  }
};

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    apiVersion: "2022-10-07",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const uploads = multerS3({
  s3: s3,
  bucket: "rigood-youtube",
  acl: "public-read",
});

const isHeroku = process.env.NODE_ENV === "production";

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const uploadMiddleware = (req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
};
