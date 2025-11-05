import {
  FiBookmark,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router";
import { obtenerIdToken, obtenerUsuarioById } from "../utils/functions";
import { useEffect, useState } from "react";

function Menu_mobile() {
  const [usuario, setUsuario] = useState({
    id_usuario: 0,
    username: "",
    email: "",
    nombre_completo: "",
    avatar: "",
    portada: "",
    biografia: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const id = await obtenerIdToken();
        const usuario = await obtenerUsuarioById(id);
        setUsuario(usuario);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuario();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <nav className="lg:hidden fixed left-0 bottom-0 bg-gray-950 p-6 flex w-full  justify-between">
      <Link to="/" className="flex gap-2 items-center">
        <FiHome className="w-7 h-7" />
      </Link>
      <Link to="/explorar" className="flex gap-2 items-center">
        <FiSearch className="w-7 h-7" />
      </Link>
      <Link to="/mensajes" className="flex gap-2 items-center">
        <FiMessageSquare className="w-7 h-7" />
      </Link>
      <Link to="/marcadores" className="flex gap-2 items-center">
        <FiBookmark className="w-7 h-7" />
      </Link>
      <Link
        to={`/perfil/${usuario.username}`}
        className="flex gap-2 items-center"
      >
        <FiUser className="w-7 h-7" />
      </Link>
      <button className="flex items-center gap-2" onClick={logOut}>
        <FiLogOut className="w-7 h-7" />
      </button>
    </nav>
  );
}

export default Menu_mobile;
