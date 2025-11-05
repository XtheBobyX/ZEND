import { Link, useNavigate } from "react-router";
import Nav_left from "../components/nav-left";
import Nav_right from "../components/nav-right";
import { IoIosSearch } from "react-icons/io";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import Boton_Seguir from "../components/boton-seguir";
import { obtenerUsuarioById, parseJwt } from "../utils/functions";
import Post from "../components/post";
import IconoMensaje from "../components/IconoMensaje";
import Menu_mobile from "../components/Menu-mobile";
const API_URL = import.meta.env.VITE_API_URL;

function Busqueda() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("usuarios");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [usuarioLogueado, setUsuarioLogueado] = useState({
    id_usuario: "",
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
    const getUsuario = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = parseJwt(token);
        const idUsuario = payload.id_usuario;

        const usuario = await obtenerUsuarioById(idUsuario);
        setUsuarioLogueado(usuario);
      }
    };

    getUsuario();

    if (!busqueda) {
      return;
    }
    const buscar = async () => {
      if (selectedOption === "usuarios") {
        const fetchUsuarios = await fetch(
          `${API_URL}/api/usuarios/buscar?search=${busqueda}`
        );
        const json = await fetchUsuarios.json();
        const data = json.data;
        setResultados(data);
      } else {
        const fetchPosts = await fetch(
          `${API_URL}api/posts/buscar?search=${busqueda}`
        );
        const json = await fetchPosts.json();

        console.log(json.data);
        setResultados(json.data);
      }
    };

    buscar();
  }, [selectedOption, busqueda]);

  return (
    <div className=" grid grid-cols-12">
      <Nav_left />
      <main className="lg:col-span-7 col-span-12 p-6">
        <div className="flex items-center space-x-6 pl-7">
          <FiArrowLeft
            className="w-7 h-7 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <p className="text-2xl font-bold">Explorar</p>
          </div>
        </div>
        <form className="relative pl-7 mt-8">
          <div className="flex">
            <select
              className="border  border-gray-500 lg:w-4/12  pl-2 py-4 px-6 text-xl rounded-xl bg-purple-600 shadow-2xl"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="usuarios">Usuarios</option>
              <option value="posts">Posts</option>
            </select>
            <input
              type="search"
              onChange={(e) => setBusqueda(e.target.value)}
              name="query"
              id="query"
              placeholder="Busca un usuario o un post"
              className="border border-purple-600 shadow-2xl pl-4 ml-8 w-full rounded-xl lg:pl-3 text-xl"
            />
          </div>
          <IoIosSearch
            size={32}
            className="absolute lg:right-8 right-2 top-1/5"
          />
        </form>

        <div className="md:pl-7 mt-12 space-y-8">
          {Array.isArray(resultados) &&
            resultados.length > 0 &&
            selectedOption === "usuarios" &&
            resultados.map((usuario: any) => (
              <div
                key={usuario.id_usuario}
                className="border rounded space-y-5 py-4 flex md:pl-8 pl-4  justify-between"
              >
                <div className="flex space-x-5">
                  <img
                    src={usuario.avatar || avatarDefault}
                    className="lg:w-18 lg:h-18 w-12 h-12 object-cover rounded-full"
                  />
                  <Link
                    to={`/perfil/${usuario.username}`}
                    className="flex flex-col  pt-2.5 cursor-pointer items-start"
                  >
                    <p className="font-bold text-lg">
                      {usuario.nombre_completo || usuario.username}
                    </p>
                    <p className="text-gray-300 text-sm">@{usuario.username}</p>
                  </Link>
                </div>

                {usuario.id_usuario != usuarioLogueado.id_usuario && (
                  <div className="flex items-center px-4">
                    <Boton_Seguir
                      idSeguido={usuario.id_usuario}
                      idSeguidor={usuarioLogueado.id_usuario}
                    />
                    <IconoMensaje id={usuario.id_usuario} />
                  </div>
                )}
              </div>
            ))}
          {Array.isArray(resultados) &&
            resultados.length >= 1 &&
            selectedOption === "posts" &&
            resultados.map((post: any) => (
              <Post post={post} key={post.id_post} />
            ))}
        </div>
        <Menu_mobile />
      </main>
      <Nav_right />
    </div>
  );
}

export default Busqueda;
