import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {});

const db = mongoose.connection;

const handleError = (error) => console.log("❌ DB 에러", error);
const handleOpen = () => console.log("✅ DB 연결");

db.on("error", handleError);
db.once("open", handleOpen);
