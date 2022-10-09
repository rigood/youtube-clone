import express from "express";
import { registerView, initLike, initSubscribe, toggleLike, toggleSubscribe, createComment, deleteComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/init-like", initLike);
apiRouter.post("/videos/:id([0-9a-f]{24})/like", toggleLike);
apiRouter.post("/videos/:id([0-9a-f]{24})/init-subscribe", initSubscribe);
apiRouter.post("/videos/:id([0-9a-f]{24})/subscribe", toggleSubscribe);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/videos/:videoId([0-9a-f]{24})/comments/:commentId([0-9a-f]{24})", deleteComment);

export default apiRouter;
