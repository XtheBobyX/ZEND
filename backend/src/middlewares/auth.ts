import jwt from "jsonwebtoken";

// AUTH
const generateToken = (user: any) => {
  return jwt.sign(user, process.env.SECRET_KEY || "secretkey", {
    expiresIn: "1h",
  });
};

const validateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token: any = authHeader?.split(" ")[1];

  if (!token) return res.status(401).send("Access denied. Token required");

  try {
    const verifiedUser = jwt.verify(token, process.env.SECRET_KEY || "secretkey");
    req.user = verifiedUser;
    next();
  } catch (error) {
    return res.json({ message: "Invalid or expired token." });
  }
};

export { generateToken, validateToken };
