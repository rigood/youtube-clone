import express from "express";

import { watch, getEdit, postEdit, deleteVideo, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id", watch);

videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id/delete").get(deleteVideo);

videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
