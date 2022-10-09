import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
