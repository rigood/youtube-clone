import express from "express";

import { logout, getEdit, postEdit, getChangePw, postChangePw, startGithubLogin, finishGithubLogin, startKakaoLogin, finishKakaoLogin, see } from "../controllers/userController";

import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);

userRouter.route("/change-pw").all(protectorMiddleware).get(getChangePw).post(postChangePw);

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);

userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
