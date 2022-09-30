export const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "Youtube";
  next();
};
