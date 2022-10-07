import "regenerator-runtime";
import "dotenv/config";

import "./db";
import "./models/User";
import "./models/Video";
import "./models/Comment";

import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`✅ 서버 연결 http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
