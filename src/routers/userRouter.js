import express from "express";

import { logout, getEdit, postEdit, getChangePw, postChangePw, startGithubLogin, finishGithubLogin, see } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);

userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.route("/change-pw").get(getChangePw).post(postChangePw);

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

userRouter.get("/:id", see);

export default userRouter;
