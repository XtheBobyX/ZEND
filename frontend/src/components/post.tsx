import avatarDefault from "../../src/assets/img/avatar-default.svg";
import type { PostType } from "../utils/interfaces";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiShare,
  FiRepeat,
} from "react-icons/fi";
import {
  calcularTiempo,
  getStyleMultimedia,
  obtenerIdToken,
} from "../../src/utils/functions";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Nav_post from "./nav-post";
import { useSocket } from "../hooks/socketContext";
const API_URL = import.meta.env.VITE_API_URL;

function Post({ post, show = true }: { post: PostType; show: boolean }) {
  const isRepost = Boolean(post.is_repost);

  const [haveLike, setHaveLike] = useState(false);
  const [haveSave, setHaveSave] = useState(false);
  const [sharedPost, setSharedPost] = useState({
    value: `http://localhost:5173/${post.usuario?.username}/post/${post.id_post}`,
    copiado: false,
  });

  const multimedia = post.multimedia || [];
  const usuario = post.usuario;
  const encuesta = post.encuesta;
  const likes = post.likes || [];

  const [likesCount, setLikesCount] = useState(likes?.length || 0);

  useEffect(() => {
    if (post?.likes) {
      setLikesCount(post.likes.length);
    }
  }, [post.likes]);

  const idLogueado = obtenerIdToken();

  useEffect(() => {
    const fetchHaveLike = async () => {
      try {
        if (!post.id_post) return;

        const res = await fetch(
          `${API_URL}/api/posts/${post.id_post}/like?usuario=${idLogueado}`
        );
        const data = await res.json();
        setHaveLike(data.haveLike);
      } catch (error) {
        console.error("Error al obtener el status del like", error);
      }
    };

    const fetchSave = async () => {
      try {
        if (!post.id_post) return;

        const res = await fetch(
          `${API_URL}/api/posts/${post.id_post}/save?usuario=${idLogueado}`
        );
        const data = await res.json();
        setHaveSave(data.haveSave);
      } catch (err) {
        console.error("Error checking save:", err);
      }
    };

    fetchHaveLike();
    fetchSave();

    if (encuesta) {
      haVotado();
    }
  }, [post.id_post, idLogueado, encuesta]);

  const [votos, setVotos] = useState<number[]>([]);

  const haVotado = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/encuesta/haVotado?usuario=${idLogueado}`
      );

      const json = await res.json();

      if (json.success) {
        const ids = json.data.map((opcion: any) => opcion.id_opcion);
        setVotos(ids);
      }
    } catch (error) {
      console.error("Error al verificar votos del usuario", error);
    }
  };

  // LIKE
  const socket = useSocket();
  const toggleLike = async () => {
    try {
      if (!post.id_post) return;

      const newState = !haveLike;

      await fetch(`${API_URL}/api/posts/${post.id_post}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idLogueado,
        }),
      });

      setHaveLike(newState);

      if (socket) {
        socket.emit("toggle_like", { id_post: post.id_post, state: newState });
      }
    } catch (error) {
      console.error("Error con toggle like", error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      if (post.id_post !== data.id_post) return;
      setLikesCount((prev) => (data.state ? prev + 1 : prev - 1));
    };
    socket.on("toggle_like", handler);
    return () => {
      socket.off("toggle_like", handler);
    };
  }, [socket, post.id_post]);

  // SAVE
  const toggleSavePost = async () => {
    try {
      await fetch(`${API_URL}/api/posts/${post.id_post}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idLogueado,
        }),
      });
      setHaveSave((prev) => !prev);
    } catch (error) {
      console.error("Error toggle save:", error);
    }
  };

  // REPOST
  const [repost, SetRepost] = useState({});
  const repostear = async () => {
    if (!post.is_repost) {
      await fetch(
        `${API_URL}/api/posts/${post.id_post}/repost?usuario=${idLogueado}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };

  // COMPARTIR
  const copiarPortapapeles = () => {
    setSharedPost((prev) => ({ ...prev, copiado: true }));
    setTimeout(
      () => setSharedPost((prev) => ({ ...prev, copiado: false })),
      2000
    );
  };

  // BORRAR
  const deletePost = async (id: number) => {
    await fetch(`${API_URL}/api/posts/id/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    if (socket) socket.emit("borrar_post", id);
  };

  // Encuesta
  const [estaVotando, setEstaVotando] = useState(false);

  const votar = async (idEncuesta: string, idOpcion: string) => {
    if (estaVotando) return;

    setEstaVotando(true);
    try {
      const res = await fetch(`${API_URL}/api/encuesta/votar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_encuesta: idEncuesta,
          id_opcion: idOpcion,
          id_usuario: idLogueado,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        console.warn(data.msg);
      }
    } catch (error) {
      console.error("Error al votar", error);
    } finally {
      setEstaVotando(false);
    }
  };

  useEffect(() => {
    if (isRepost) {
      const obtenerPostFromRepost = async () => {
        // Obtener el post
        const fetchPost = await fetch(
          `${API_URL}/api/posts/id/${post.id_post_original}`
        );
        const data = await fetchPost.json();
        const postData = data.data;
        SetRepost(postData);
      };
      obtenerPostFromRepost();
    }
  }, [isRepost, post.id_post_original]);

  const [visibleModal, SetVisibleModal] = useState(false);
  const openModal = () => {
    SetVisibleModal((prev) => !prev);
  };

  const handleCheckboxChange = (idOpcion: number) => {
    if (votos.includes(idOpcion)) {
      setVotos(votos.filter((id) => id !== idOpcion));
    } else {
      setVotos([...votos, idOpcion]);
    }
  };

  const handleRadioChange = (idOpcion: number) => {
    setVotos([idOpcion]);
  };

  return (
    <>
      {isRepost && repost && (
        <div
          className="mt-4 border border-gray-400 rounded-xl p-4"
          key={post.id_post}
        >
          <div className="flex space-x-5 items-center">
            <img
              src={post.usuario?.avatar || avatarDefault}
              className="w-14 h-14 rounded-full object-cover mt-2 mr-3"
            />
            <div className="flex items-center space-x-5  mb-3 justify-between w-full">
              <div className="flex">
                <Link
                  to={`/perfil/${usuario?.username}`}
                  className="flex space-x-2 hover:underline"
                >
                  <p className="font-bold text-white">
                    {post.usuario?.nombre_completo || post.usuario?.username}
                  </p>
                  <p>@{post.usuario?.username}</p>
                </Link>
                <p> • {calcularTiempo(post.createdAt)}</p>
              </div>

              <div className="relative">
                <Nav_post
                  visibleModal={visibleModal}
                  post={post}
                  idLogueado={idLogueado}
                  deletePost={deletePost}
                  openModal={openModal}
                  copiarPortapapeles={copiarPortapapeles}
                  sharedPost={sharedPost}
                  usuario={usuario}
                  toggleSavePost={toggleSavePost}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2 pl-17 mt-[-20px]">
            @{post.usuario?.username} ha reposteado
          </p>
          <div className="w-11/12 mx-auto">
            <Post post={repost} show={false} />
          </div>

          {/* Interacciones */}
          <div className="flex items-center justify-between pl-19 pt-7 px-2 text-gray-300 ">
            <div className="flex items-center gap-2">
              <FiHeart
                onClick={() => toggleLike()}
                className={`w-6 h-6 cursor-pointer hover:text-red-500 transition ${
                  haveLike ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="text-xl">{likesCount}</span>
            </div>
            <div>
              <Link
                to={`/${post.usuario?.username}/post/${post.id_post}`}
                className="flex items-center gap-2"
              >
                <FiMessageCircle className="w-6 h-6 cursor-pointer hover:text-blue-400 transition" />
                <span className="text-xl">{post.comentarios?.length}</span>
              </Link>
            </div>

            <div
              onClick={() => repostear()}
              className="flex items-center gap-2"
            >
              <FiRepeat className="w-6 h-6 cursor-pointer hover:text-green-400 transition" />
              <span className="text-xl">{post.reposts?.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBookmark
                onClick={() => toggleSavePost()}
                className={`w-6 h-6 cursor-pointer hover:text-yellow-400 transition ${
                  haveSave ? "fill-yellow-400 text-yellow-400" : ""
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <CopyToClipboard
                text={sharedPost.value}
                onCopy={() => copiarPortapapeles()}
              >
                <FiShare className="w-6 h-6 cursor-pointer hover:text-purple-400 transition" />
              </CopyToClipboard>
              {sharedPost.copiado ? (
                <span style={{ color: "green" }}>Copiado!</span>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {!isRepost && (
        <div className="w-full max-w-3xl border border-white mt-10 rounded-xl p-5 shadow-2xl">
          {/* usuario */}

          <div className="w-full flex items-start">
            <img
              src={usuario?.avatar || avatarDefault}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover mt-2 mr-3"
            />

            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between text-lg text-gray-300">
                <div className="flex items-center  space-x-5">
                  <Link
                    to={`/perfil/${usuario?.username}`}
                    className="flex md:flex-row flex-col space-x-5  hover:underline"
                  >
                    <p className="font-bold text-white">
                      {usuario?.nombre_completo || usuario?.username}
                    </p>
                    <p>@{usuario?.username}</p>
                  </Link>
                  <p> • {calcularTiempo(post.createdAt)}</p>
                </div>
                {/* Menu lateral */}
                {show && (
                  <div className="relative">
                    <Nav_post
                      visibleModal={visibleModal}
                      post={post}
                      idLogueado={idLogueado}
                      deletePost={deletePost}
                      openModal={openModal}
                      copiarPortapapeles={copiarPortapapeles}
                      sharedPost={sharedPost}
                      usuario={usuario}
                      toggleSavePost={toggleSavePost}
                    />
                  </div>
                )}
              </div>

              <p className="text-lg break-words max-w-2xl">{post.contenido}</p>
            </div>
          </div>
          {/* Encuesta */}
          {encuesta && (
            <div className="mt-5 border rounded-xl p-2 pl-8 ">
              <p className="text-2xl py-4">{encuesta.titulo}</p>
              <div className="py-2 ">
                {encuesta.opciones_encuesta.map((opcion) => (
                  <div
                    className="flex items-center space-x-10 cursor-pointer "
                    key={opcion.id_opcion}
                    onClick={() =>
                      votar(encuesta.id_encuesta, opcion.id_opcion)
                    }
                  >
                    <label
                      htmlFor={`${opcion.id_opcion}`}
                      className={`border w-10/12 rounded p-3 mb-2 cursor-pointer ${
                        votos.includes(Number(opcion.id_opcion))
                          ? "bg-purple-500"
                          : ""
                      }`}
                    >
                      <span className={`text-xl `}>{opcion.texto}</span>
                    </label>
                    {encuesta.multiple_opciones && (
                      <input
                        type="checkbox"
                        checked={votos.includes(Number(opcion.id_opcion))}
                        onChange={() => handleCheckboxChange(opcion.id_opcion)}
                        id={`${opcion.id_opcion}`}
                        className="w-4 h-4 cursor-pointer"
                      />
                    )}
                    {!encuesta.multiple_opciones && (
                      <input
                        type="radio"
                        checked={votos.includes(Number(opcion.id_opcion))}
                        onChange={() => handleRadioChange(opcion.id_opcion)}
                        name={`votar-${encuesta.id_encuesta}`}
                        id={`${opcion.id_opcion}`}
                        className="w-4 h-4 cursor-pointer"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* multimedia */}
          {multimedia.length > 0 && (
            <div
              className={`mt-8 w-full ${getStyleMultimedia(
                post.multimedia.length
              )}`}
            >
              {post.multimedia.map((img, index) => (
                <img
                  key={index}
                  src={img.url_archivo}
                  className={`object-cover w-full max-h-64 rounded-2xl ${
                    post.multimedia.length === 3 && index === 2
                      ? "col-span-2"
                      : ""
                  }`}
                />
              ))}
            </div>
          )}
          {/* Interacciones */}
          {show && (
            <div className="flex items-center justify-between md:pl-19 pl-0 space-x-5 pt-7 px-2 text-gray-300 ">
              <div className="flex items-center gap-2">
                <FiHeart
                  onClick={() => toggleLike()}
                  className={`w-7 h-7 cursor-pointer hover:text-red-500 transition ${
                    haveLike ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-xl">{likesCount}</span>
              </div>
              <div>
                <Link
                  to={`/${post.usuario?.username}/post/${post.id_post}`}
                  className="flex items-center gap-2"
                >
                  <FiMessageCircle className="w-7 h-7 cursor-pointer hover:text-blue-400 transition" />
                  <span className="text-xl">{post.comentarios?.length}</span>
                </Link>
              </div>
              <div
                onClick={() => repostear()}
                className="flex items-center gap-2"
              >
                <FiRepeat className="w-7 h-7 cursor-pointer hover:text-green-400 transition" />
                <span className="text-xl">{post.reposts?.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBookmark
                  onClick={() => toggleSavePost()}
                  className={`w-7 h-7 cursor-pointer hover:text-yellow-400 transition ${
                    haveSave ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <CopyToClipboard
                  text={sharedPost.value}
                  onCopy={() => copiarPortapapeles()}
                >
                  <FiShare className="w-7 h-7 cursor-pointer hover:text-purple-400 transition" />
                </CopyToClipboard>
                {sharedPost.copiado ? (
                  <span style={{ color: "green" }}>Copiado!</span>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Post;
