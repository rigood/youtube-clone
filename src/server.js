import express from "express";

import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import { localsMiddleware } from "./middlewares";
import "moment/locale/ko";

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash());
app.use(localsMiddleware);

/* Static */
app.use("/static", express.static("assets"));
app.use("/uploads", express.static("uploads"));

/* Router */
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
