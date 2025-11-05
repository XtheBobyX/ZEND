import { Link } from "react-router";
import zendLogo from "../assets/img/zend-logo.svg";
import { useEffect, useState } from "react";
import avatarDefault from "../../src/assets/img/avatar-default.svg";

// Iconos
import {
  FiHome,
  FiSearch,
  FiMessageSquare,
  FiBookmark,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { obtenerIdToken, obtenerUsuarioById } from "../utils/functions";

function Nav_left() {
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
    <div className="hidden lg:block col-span-2  p-12  border-r border-gray-500 h-screen sticky top-0">
      <img src={zendLogo} alt="Logo de la app" className="w-14 h-14" />
      <nav className="flex flex-col mt-16 gap-12 text-xl">
        <Link to="/" className="flex gap-2 items-center">
          <FiHome className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link to="/explorar" className="flex gap-2 items-center">
          <FiSearch className="w-6 h-6" />
          Explorar
        </Link>
        <Link to="/mensajes" className="flex gap-2 items-center">
          <FiMessageSquare className="w-6 h-6" />
          Mensajes
        </Link>
        <Link to="/marcadores" className="flex gap-2 items-center">
          <FiBookmark className="w-6 h-6" />
          Marcadores
        </Link>
        <Link
          to={`/perfil/${usuario.username}`}
          className="flex gap-2 items-center"
        >
          <FiUser className="w-6 h-6" />
          Perfil
        </Link>
        <button className="flex items-center gap-2" onClick={logOut}>
          <FiLogOut className="w-6 h-6" />
          Cerrar Sesión
        </button>

        <div className="border w-50">
          <div className="flex px-6 py-3 items-center gap-2">
            <img
              src={usuario.avatar || avatarDefault}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-bold">
                {usuario.nombre_completo || usuario.username}
              </p>
              <p className="text-sm text-gray-200">@{usuario.username}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav_left;
