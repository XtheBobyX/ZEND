import express from "express";
import cors from "cors";
import usuarioRoutes from "./src/routes/usuarioRutas";
import postRoutes from "./src/routes/postRutas";
import followRoutes from "./src/routes/followRutas";
import encuestaRutas from "./src/routes/encuestaRutas";
import mensajesRutas from "./src/routes/mensajesRutas";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = process.env.PORT;
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", // desarrollo local
  "http://localhost:3000", // desarrollo local
  "https://zendv2.vercel.app/", // producción frontend
  "https://zend-7pid.onrender.com/", // producción backend
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

  socket.on("borrar_post", (id) => {
    io.emit("borrar_post", id);
  });

  socket.on("enviar_comentario", (data) => {
    io.emit("recibir_comentario", data);
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
  socket.on("enviar_mensaje", (data) => {
    const sala = [data.id_remitente, data.id_receptor].sort().join("-");
    io.to(sala).emit("recibir_mensaje", data);
  });

  //
});

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/encuesta", encuestaRutas);
app.use("/api/mensaje", mensajesRutas);

//
server.listen(PORT, () => {
  console.log(
    `Servidor escuchando en http://localhost:${PORT} o ${process.env.DB_HOST} `
  );
});

export default app;
