import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Youtube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const uploadFiles = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});
