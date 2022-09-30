import app from "./server";

const PORT = 4000;

const handleListening = () => console.log(`✅ 서버 연결 http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
