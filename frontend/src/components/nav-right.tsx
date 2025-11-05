import { useEffect, useState } from "react";
import avatarDefault from "../assets/img/avatar-default.svg";
import { Link } from "react-router";
import { obtenerIdToken, obtenerUsuarioById } from "../utils/functions";
import type { UsuarioType } from "../utils/interfaces";
import Boton_Seguir from "./boton-seguir";
import { useSocket } from "../hooks/socketContext";
const API_URL = import.meta.env.VITE_API_URL;

function Nav_right() {
  const [usuarioTopPopulares, setUsuarioTopPopulares] = useState([
    {
      id_usuario: "",
      avatar: "",
      nombre_completo: "",
      username: "",
    },
  ]);

  const [miUsuario, setMiUsuario] = useState<UsuarioType>({
    id_usuario: "",
    avatar: "",
    nombre_completo: "",
    username: "",
  });

  const fetchTop = async () => {
    const url = `${API_URL}/api/follow/top`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setUsuarioTopPopulares(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTop();
  }, []);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const id = await obtenerIdToken();
        const usuario = await obtenerUsuarioById(id);
        setMiUsuario(usuario);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuario();
  }, []);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    socket.on("toggle_follow", () => {
      fetchTop();
    });
  }, [socket]);

  return (
    <div className="w-full hidden lg:block border-l col-span-3 border-gray-500  h-screen sticky top-0 ">
      <div className="bg-[#18181B] min-h-96 ml-7 mt-8 rounded-2xl  ">
        <p className="text-2xl text-center pt-8">Populares</p>
        <div className="mt-8">
          {usuarioTopPopulares?.map((usuario) => (
            <div
              key={usuario.id_usuario}
              className="flex border border-gray-300 rounded-2xl mb-3 p-6 mx-1 justify-between"
            >
              <Link
                to={`/perfil/${usuario.username}`}
                className="flex space-x-4"
              >
                <img
                  src={usuario.avatar || avatarDefault}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p>{usuario.nombre_completo || usuario.username}</p>

                  <p className="text-gray-300 text-sm">@{usuario.username}</p>
                </div>
              </Link>
              {miUsuario.username !== usuario.username && (
                <Boton_Seguir
                  idSeguidor={miUsuario.id_usuario}
                  idSeguido={usuario.id_usuario}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Nav_right;
