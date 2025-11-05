import { FiArrowLeft } from "react-icons/fi";
import Nav_left from "../components/nav-left";
import Nav_right from "../components/nav-right";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  obtenerUsuarioById,
  obtenerUsuarioByUsername,
  parseJwt,
} from "../utils/functions";
import Boton_Seguir from "../components/boton-seguir";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import IconoMensaje from "../components/IconoMensaje";
import Menu_mobile from "../components/Menu-mobile";
const API_URL = import.meta.env.VITE_API_URL;

function Follows() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const tipoRuta = location.pathname.includes("seguidores")
    ? "seguidores"
    : "seguidos";
  const [tipo, setTipo] = useState(tipoRuta);

  const [usuarios, setUsuarios] = useState([]);
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
    setTipo(tipoRuta);
    //
    const getUsuario = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = parseJwt(token);
        const idUsuario = payload.id_usuario;

        const usuario = await obtenerUsuarioById(idUsuario);
        setUsuarioLogueado(usuario);
      }
    };
    // Obtener datos
    const f = tipoRuta === "seguidores" ? "seguidores" : "seguidos";

    const fetchSeguidores = async () => {
      const usuario = await obtenerUsuarioByUsername(id);
      const response = await fetch(
        `${API_URL}/api/follow/usuarios/${usuario.id_usuario}/${f}`
      );
      const data = await response.json();
      setUsuarios([]);
      setUsuarios(data.data.rows);
    };
    getUsuario();

    fetchSeguidores();
  }, [id, tipoRuta]);

  return (
    <div className="grid grid-cols-12">
      <Nav_left />
      <main className="lg:col-span-7 col-span-12 p-6">
        <div className="flex items-center space-x-5">
          <FiArrowLeft
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(`/perfil/${id}`)}
          />
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">{id}</h1>
            <p className="text-lg">
              {usuarios.length}
              <span>
                {" "}
                {tipo === "seguidores"
                  ? usuarios.length == 1
                    ? "Seguidor"
                    : "Seguidores"
                  : "Seguidos"}
              </span>
            </p>
          </div>
        </div>
        <div>
          <nav className="flex justify-between gap-12 text-xl mt-8">
            <Link
              to={`/seguidores/${id}`}
              className={`${
                tipoRuta === "seguidores"
                  ? "border-b-4 border-b-purple-600"
                  : ""
              }  w-full text-center pb-4`}
            >
              Seguidores
            </Link>
            <Link
              to={`/seguidos/${id}`}
              className={`${
                tipoRuta !== "seguidores"
                  ? "border-b-4 border-b-purple-600"
                  : ""
              }  w-full text-center`}
            >
              Seguidos
            </Link>
          </nav>
          <section>
            {usuarios.map((usuario) => {
              const u =
                tipoRuta === "seguidores" ? usuario.seguidor : usuario.seguido;

              if (!u) return;
              return (
                <div
                  key={u.id_usuario}
                  className="border flex justify-between p-4 mt-2"
                >
                  <div className="flex space-x-5">
                    <img
                      src={u.avatar || avatarDefault}
                      className="w-18 h-18 object-cover rounded-full"
                    />
                    <Link
                      to={`/perfil/${u?.username}`}
                      className="flex flex-col"
                    >
                      <p className="text-xl font-bold">
                        {u.nombre_completo || u.username}
                      </p>
                      <p className="text-gray-300">@{u.username}</p>
                    </Link>
                  </div>
                  {usuarioLogueado.id_usuario !== u.id_usuario && (
                    <div className="flex md:flex-row flex-col space-y-2 items-center">
                      <IconoMensaje id={u.id_usuario} />
                      <Boton_Seguir
                        idSeguidor={usuarioLogueado.id_usuario}
                        idSeguido={u.id_usuario}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>
        <Menu_mobile />
      </main>
      <Nav_right />
    </div>
  );
}

export default Follows;
