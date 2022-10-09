import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;
