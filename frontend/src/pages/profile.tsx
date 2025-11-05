import "../index.css";
import Nav_left from "../components/nav-left";
import Nav_right from "../components/nav-right";

import { useEffect, useState } from "react";

import {
  obtenerUsuarioById,
  obtenerUsuarioByUsername,
  parseJwt,
} from "../utils/functions";
const API_URL = import.meta.env.VITE_API_URL;

// Iconos
import { FiArrowLeft } from "react-icons/fi";
import portada from "../assets/img/background.jpg";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { Link, useNavigate, useParams } from "react-router";
import Post from "../components/post";
import Boton_Seguir from "../components/boton-seguir";
import IconoMensaje from "../components/IconoMensaje";
import Menu_mobile from "../components/Menu-mobile";
import { useSocket } from "../hooks/socketContext";

function Profile() {
  const { id: username } = useParams();

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

  const [perfil, setPerfil] = useState({
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

  const [posts, setPosts] = useState([
    {
      id_post: "",
      id_usuario: "",
      contenido: "",
      is_repost: "",
      createdAt: "",
      updatedAt: "",
      Usuario: {
        id_usuario: "",
        username: "",
        email: "",
        nombre_completo: "",
        avatar: "",
        portada: "",
        biografia: "",
      },
    },
  ]);
  const isMy = usuarioLogueado.username === username;

  const [seguidos, setSeguidos] = useState({ rows: null, count: null });
  const [seguidores, setSeguidores] = useState({ rows: null, count: null });

  // Obtener las estadisticas del perfil
  const obtenerEstadisticasPerfil = async () => {
    if (!perfil.id_usuario) return;
    const seguidores = await fetch(
      `${API_URL}/api/follow/usuarios/${perfil.id_usuario}/seguidores`
    );
    const data = await seguidores.json();

    const seguidos = await fetch(
      `${API_URL}/api/follow/usuarios/${perfil.id_usuario}/seguidos`
    );
    const dataSeguidos = await seguidos.json();

    setSeguidores(data.data);
    setSeguidos(dataSeguidos.data);
  };

  useEffect(() => {
    // Obtener Perfil del usuario por su username
    const getUsuarioByUsername = async () => {
      const perfil = await obtenerUsuarioByUsername(username);
      setPerfil(perfil);
    };
    getUsuarioByUsername();

    obtenerEstadisticasPerfil();
  }, [username, perfil.id_usuario]);

  // Obtener datos del usuario logueado
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
  }, [perfil.id_usuario, usuarioLogueado.id_usuario]);

  useEffect(() => {
    const obtenerTimeline = async () => {
      if (!perfil.id_usuario) return;
      const url = `${API_URL}/api/posts/usuario/${perfil.id_usuario}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const post = result.data;

        if (post) {
          setPosts(post?.reverse());
        }
      } catch (error) {
        console.error(error);
      }
    };
    obtenerTimeline();
  }, [perfil.id_usuario]);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const createPost = (post) => {
      setPosts((prev) => [post, ...prev]);
    };
    const deletePost = (id) => {
      setPosts((prev) => prev.filter((p) => p.id_post !== id));
    };
    const follow = () => {
      obtenerEstadisticasPerfil();
      console.log("toggle");
    };

    socket.on("receive_new_post", createPost);
    socket.on("borrar_post", deletePost);
    socket.on("toggle_follow", follow);

    return () => {
      socket.off("receive_new_post", createPost);
      socket.off("borrar_post", deletePost);
      socket.off("toggle_follow", follow);
    };
  }, [socket, perfil.id_usuario]);

  const navigate = useNavigate();
  return (
    <div className=" grid grid-cols-12">
      <Nav_left />

      <main className="lg:col-span-7 col-span-12  mx-auto max-w-4xl  pb-20">
        <div className="pt-4">
          <div className="flex items-center space-x-6 pl-7">
            <FiArrowLeft
              className="w-7 h-7 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <div>
              <p className="text-2xl font-bold">
                {perfil.nombre_completo || perfil.username}
              </p>
              <p className="text-xl">
                <span>{posts.length}</span> Post
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src={perfil.portada || portada}
              alt=""
              className="mt-6 w-7xl h-68 object-cover"
            />
            <img
              src={perfil.avatar || avatarDefault}
              alt=""
              className="w-28 h-28 rounded-full absolute bottom-[-50px] ml-16 object-cover"
            />
          </div>
          <div className="ml-7 mt-20">
            <div className="flex justify-between items-center">
              <div className="ml-12">
                <p className="text-2xl font-bold">
                  {perfil.nombre_completo || perfil.username}
                </p>
                <p className="text-xl text-gray-300">@{perfil.username}</p>
              </div>
              <div className="flex items-center">
                {!isMy && <IconoMensaje id={perfil.id_usuario} />}

                {isMy ? (
                  <Link
                    to={`/crear-perfil?editar`}
                    state={{ username: perfil.username }}
                  >
                    <button className="px-6 py-3 mx-6 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer">
                      Editar
                    </button>
                  </Link>
                ) : (
                  <Boton_Seguir
                    idSeguidor={usuarioLogueado.id_usuario}
                    idSeguido={perfil.id_usuario}
                  />
                )}
              </div>
            </div>
            <div className="ml-12 mt-5">
              <p className="text-xl">{perfil.biografia}</p>
            </div>
            {/* Estadisticas */}
            <div className="flex md:flex-row flex-col space-x-6 mt-4 max-w-3xl mx-auto ">
              <Link
                to={`/seguidos/${perfil.username}`}
                className="border mt-5 md:w-1/3 w-full text-center p-4"
              >
                <p className="font-bold text-3xl text-center">
                  {seguidos.count}
                </p>
                <p className="text-2xl">Seguiendo</p>
              </Link>
              <Link
                to={`/seguidores/${perfil.username}`}
                className="border mt-5 md:w-1/3 w-full text-center p-4"
              >
                <p className="font-bold text-3xl text-center">
                  {seguidores.count}
                </p>
                <p className="text-2xl">Seguidores</p>
              </Link>
              <div className="border mt-5 md:w-1/3   text-center p-4">
                <p className="font-bold text-3xl text-center">
                  <span>{posts.length}</span>
                </p>
                <p className="text-2xl">Post</p>
              </div>
            </div>

            {posts.map((post) => (
              <div key={post.id_post} className="max-w-3xl mx-auto w-full">
                <Post post={post} />
              </div>
            ))}
          </div>
        </div>
        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default Profile;
