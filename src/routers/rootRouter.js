import express from "express";

import { home, search, hashtag } from "../controllers/videoController";

import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";

import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.get("/hashtag=:hashtag", hashtag);

rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);

export default rootRouter;
