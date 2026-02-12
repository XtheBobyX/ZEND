import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import userRoutes from "./src/routes/userRoutes";
import postRoutes from "./src/routes/postRoutes";
import followRoutes from "./src/routes/followRoutes";
import pollRoutes from "./src/routes/pollRoutes";
import messageRoutes from "./src/routes/messagesRoutes";

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", // desarrollo local
  "http://localhost:3000", // desarrollo local
  "", // producción frontend
  "", // producción backend
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  // Home & Post
  socket.on("create_new_post", (post) => {
    socket.emit("receive_new_post", post);
  });

  socket.on("delete_post", (id) => {
    io.emit("delete_post", id);
  });

  socket.on("send_comment", (data) => {
    io.emit("receive_comment", data);
  });

  socket.on("toggle_like", (data) => {
    io.emit("toggle_like", data);
  });

  // Perfil
  socket.on("toggle_follow", (data) => {
    io.emit("toggle_follow", data);
  });

  // Chat
  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_message", (data) => {
    console.log("Debbugging: ", data);
    const sala = [data.sender_id, data.receiver_id].sort().join("-");
    io.to(sala).emit("receive_message", data);
  });

  //
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/poll", pollRoutes);
app.use("/api/message", messageRoutes);

//
server.listen(PORT, () => {
  console.log(
    `Servidor listening in http://localhost:${PORT} o ${process.env.DB_HOST} `,
  );
});

export default app;
