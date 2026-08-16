import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { verifyToken } from "./utils/jwt.utils.js";
import { User } from "./model/user.model.js";

const port = process.env.PORT || 5000;

// sambungkan ke database DULU, baru nyalakan server
await connectDB();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});

app.set("io", io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Token tidak ditemukan, silakan login dulu"));
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return next(new Error("Pengguna tidak ditemukan"));
    }
    // Simpan data user di socket, bisa dipakai di event lain nanti.
    socket.data.user = user;
    next();
  } catch {
    next(new Error("Token tidak valid"));
  }
});

io.on("connection", (socket) => {
  console.log("Client Terhubung: ", socket.id);

  socket.on("disconnect", () => {
    console.log("Client terputus: ", socket.id);
  });
});

server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
