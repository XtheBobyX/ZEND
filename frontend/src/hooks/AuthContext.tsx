import { createContext, useContext, useEffect, useState } from "react";
import { obtenerUsuarioById, parseJwt } from "../utils/functions";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const refrescarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = parseJwt(token);
    const now = Date.now() / 1000;

    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      return;
    }

    try {
      const usuario = await obtenerUsuarioById(payload.id_usuario);
      setUsuario(usuario);
    } catch (error) {
      console.error("Error obteniendo usuario: ", error);
      setUsuario(null);
    }
  };

  useEffect(() => {
    refrescarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, refrescarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }

  return context;
};
