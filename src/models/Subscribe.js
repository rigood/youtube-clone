import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;
