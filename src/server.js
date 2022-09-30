import express from "express";

import morgan from "morgan";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";

const app = express();

/* Pug */
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

/* Middlewares */
app.use(morgan("dev"));

/* Router */
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
