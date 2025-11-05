import jwt from "jsonwebtoken";

// AUTH
const generarToken = (usuario: any) => {
  return jwt.sign(usuario, process.env.SECRET_KEY || "secretkey", {
    expiresIn: "1h",
  });
};

const validarToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token: any = authHeader?.split(" ")[1];

  if (!token) return res.status(401).send("Acceso Denegado. Token requerido");

  try {
    const usuario = jwt.verify(token, process.env.SECRET_KEY || "secretkey");
    req.user = usuario;
    next();
  } catch (error) {
    return res.json({ message: "Token inválido o expirado." });
  }
};

export { generarToken, validarToken };
