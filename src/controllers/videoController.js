import User from "../models/User";
import Video from "../models/Video";

export const home = (req, res) => res.render("home");

export const search = (req, res) => res.send("search");

export const watch = (req, res) => res.send("watch");

export const getEdit = (req, res) => res.send("getEdit");
export const postEdit = (req, res) => res.send("postEdit");

export const deleteVideo = (req, res) => res.send("deleteVideo");

export const getUpload = (req, res) => res.send("getUpload");
export const postUpload = (req, res) => res.send("postUpload");
