import React, { useEffect, useState } from "react";
import Nav_left from "../components/nav-left";
import Nav_right from "../components/nav-right";
import Post from "../components/post";

import "../index.css";

import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { FiImage, FiSmile, FiBarChart, FiXCircle, FiX } from "react-icons/fi";

import { IoIosClose } from "react-icons/io";

import {
  getStyleMultimedia,
  obtenerUsuarioById,
  parseJwt,
} from "../utils/functions";

import type {
  MultimediaType,
  PostType,
  UsuarioType,
} from "../utils/interfaces";

import data, { type Skin } from "@emoji-mart/data";

import Picker from "@emoji-mart/react";
import Menu_mobile from "../components/Menu-mobile";
import { useSocket } from "../hooks/socketContext";
const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [usuario, setUsuario] = useState<UsuarioType>({
    id_usuario: "",
    username: "",
    email: "",
    nombre_completo: "",
    avatar: "",
    portada: "",
    biografia: "",
  });

  const encuestaVacia = {
    id_encuesta: "",
    id_post: "",
    titulo: "",
    multiple_opciones: false,
    opciones_encuesta: [
      { id_opcion: "", id_encuesta: "", texto: "" },
      { id_opcion: "", id_encuesta: "", texto: "" },
    ],
  };

  const [post, setPost] = useState<PostType>({
    id_usuario: "",
    contenido: "",
    is_repost: 0,
    multimedia: [],
    encuesta: encuestaVacia,
    likes: [],
    comentarios: [],
    reposts: [],
  });

  const [timeline, setTimeline] = useState<any>([]);

  const [estaVisiblePicker, setEstaVisiblePicker] = useState(false);
  const [visibleEncuesta, setVisibleEncuesta] = useState(false);

  const socket: any = useSocket();

  // Obtener posts (timeline)
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const posts = await res.json();
      setTimeline(posts.data?.reverse());
    } catch (err) {
      console.error("Error al obtener posts:", err);
    }
  };

  useEffect(() => {
    fetchData();
    setInterval(fetchData, 10000);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_new_post", (post) => {
      if (!post || !post.id_post) return;
      setTimeline((prev) => {
        const existe = prev.some((p) => p.id_post === post.id_post);
        if (existe) return prev;
        return [post, ...prev];
      });
    });

    socket.on("borrar_post", (id) => {
      setTimeline((prev) => prev.filter((p) => p.id_post !== id));
    });
  }, [socket]);

  const eliminarOpcion = (index: number) => {
    if (post.encuesta.opciones_encuesta.length <= 2) {
      alert("Minimo 2 opciones");
      return;
    }
    setPost((prev) => ({
      ...prev,
      encuesta: {
        ...prev.encuesta,
        opciones_encuesta: prev.encuesta.opciones_encuesta.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleToggle = () => setEstaVisiblePicker((prev) => !prev);

  const handleOpen = () => {
    // Si se cierra la encuesta no se guarda
    if (visibleEncuesta) {
      setPost((prev) => ({
        ...prev,
        encuesta: encuestaVacia,
      }));
    }

    setVisibleEncuesta((prev) => !prev);
  };

  const guardarEncuesta = () => {
    setVisibleEncuesta((prev) => !prev);
  };

  const setTituloEncuesta = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPost((prev) => ({
      ...prev,
      encuesta: { ...prev.encuesta, titulo: e.target.value },
    }));

  const setMultipleOpcionesEncuesta = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPost((prev) => ({
      ...prev,
      encuesta: { ...prev.encuesta, multiple_opciones: !!e.target.value },
    }));
  };

  const setOpcionesEncuesta = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const nuevasOpciones = [...post.encuesta.opciones_encuesta];
    nuevasOpciones[index] = { ...nuevasOpciones[index], texto: e.target.value };

    setPost((prev) => ({
      ...prev,
      encuesta: {
        ...prev.encuesta,
        opciones_encuesta: nuevasOpciones,
      },
    }));
  };

  // Obtener informanción del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = parseJwt(token);
        const usuario = await obtenerUsuarioById(payload.id_usuario);
        setUsuario(usuario);
        setPost((prev) => ({ ...prev, id_usuario: usuario.id_usuario }));
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUsuario();
  }, [usuario.id_usuario]);

  // Manejar cambios en textarea

  const handleInputs = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setPost((prev) => ({ ...prev, contenido: value }));
  };

  // Manejar archivos seleccionados
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const maxFiles = 4;

    if (!files) return;

    if (files.length > maxFiles) {
      alert(`Solo puedes subir hasta ${maxFiles} imágenes.`);
      e.target.value = "";
      return;
    }

    const arrayArchivos = Array.from(files);
    const links: [] = [];
    let contador = 0;

    arrayArchivos.forEach((archivo) => {
      const reader = new FileReader();

      reader.onload = () => {
        const urlBase64 = reader.result as string;
        links.push(urlBase64);
        contador++;

        if (contador === arrayArchivos.length) {
          setPost((prev) => ({ ...prev, multimedia: links }));
        }
      };
      reader.readAsDataURL(archivo);
    });
  };

  const publicarPost = async (e: React.FormEvent) => {
    e.preventDefault();

    const tieneContenido = post.contenido.trim() !== "";
    const tieneImagenes = post.multimedia.length > 0;
    const opcionesEncuesta = post.encuesta.opciones_encuesta;
    const tieneEncuestaValida =
      post.encuesta.titulo.trim() !== "" &&
      opcionesEncuesta.length >= 2 &&
      opcionesEncuesta[0].texto.trim() !== "" &&
      opcionesEncuesta[1].texto.trim() !== "";

    if (!usuario) return;
    if (!tieneContenido && !tieneImagenes && !tieneEncuestaValida) return;

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      setPost((prev) => ({
        ...prev,
        contenido: "",
        multimedia: [],
        encuesta: encuestaVacia,
      }));

      const json = await res.json();

      if (!res.ok) throw new Error("Error al publicar");

      setEstaVisiblePicker(false);
      setVisibleEncuesta(false);

      if (socket) {
        socket.emit("create_new_post", json.data);
      }
    } catch (error) {
      console.error("Error al publicar post:", error);
    }
  };

  // Enviar post con Enter

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!post.contenido) return;
    if (e.key === "Enter") {
      publicarPost(e);
    }
  };

  // Borrar imagen del preview
  const borrarImagen = (index: number) => {
    setPost((prev) => ({
      ...prev,
      multimedia: prev.multimedia.filter(
        (_: MultimediaType, i: number) => i !== index
      ) as [],
    }));
  };

  const agregarEmoji = (e: Skin) => {
    setPost((prev) => ({ ...prev, contenido: prev.contenido + e.native }));
  };

  const encuestaEsvalida = () => {
    const { titulo, opciones_encuesta } = post.encuesta;

    if (!titulo.trim()) return false;
    if (opciones_encuesta.length < 2) return false;

    // Comprobar que las 2 primeras opciones tengan texto
    const primerasOpciones = opciones_encuesta.slice(0, 2);
    return primerasOpciones.every((op) => op.texto.trim() !== "");
  };

  const agregarOpcion = () => {
    setPost((prev) => ({
      ...prev,
      encuesta: {
        ...prev.encuesta,
        opciones_encuesta: [
          ...prev.encuesta.opciones_encuesta,
          { id_opcion: "", id_encuesta: "", texto: "" },
        ],
      },
    }));
  };

  return (
    <div className="lg:grid grid-cols-12">
      <Nav_left />

      <main className="p-6 lg:col-span-7  mx-auto">
        {/* Formulario de subir Post */}
        <form
          action=""
          onSubmit={publicarPost}
          className="border border-white w-full rounded-3xl"
        >
          <div className="mx-5 mt-7 gap-6 relative">
            <img
              src={usuario.avatar || avatarDefault}
              alt=""
              className="w-14 h-14 rounded-full absolute top-1/4 left-8 transform -translate-y-1/3 object-cover"
            />

            <textarea
              placeholder="Que estas pensando ?"
              value={post.contenido}
              onChange={handleInputs}
              onKeyDown={handleKey}
              className="text-xl border border-white w-full h-44 lg:pl-28 pl-24 pt-7 placeholder:text-gray-300 resize-none pr-2"
            ></textarea>
          </div>
          {/* Preview Multimedia */}
          {post.multimedia.length > 0 && (
            <div className="relative w-11/12 ml-5  mt-4">
              <div
                className={`${getStyleMultimedia(
                  post.multimedia.length
                )} border border-gray-500 p-2 gap-8 shadow`}
              >
                {post.multimedia?.map((preview: string, index: number) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div
                      className="absolute top-2 right-2 hover:cursor-pointer"
                      onClick={() => borrarImagen(index)}
                    >
                      <IoIosClose className="w-6 h-6 border rounded-full bg-purple-500 hover:bg-purple-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Encuesta */}
          {encuestaEsvalida() && (
            <div className="mx-4 mt-5 border rounded-xl p-2 pl-8">
              <p className="text-2xl py-4">{post.encuesta.titulo}</p>
              <div className="py-2 cursor-pointer">
                {post.encuesta.opciones_encuesta.map((opcion, index) => (
                  <div
                    key={index}
                    className={`border w-10/12 rounded p-3 mb-2 hover:bg-purple-500`}
                  >
                    <p className={`text-xl `}>{opcion.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones añadir al Post */}
          <div className="flex justify-between items-center mt-3 mb-2">
            <div className="ml-10 my-3 flex space-x-4 cursor-pointer">
              {/* Imagen */}
              <div data-role="image-button">
                <label htmlFor="imgUpload">
                  <FiImage className="w-8 h-9 cursor-pointer" />
                </label>
                <input
                  type="file"
                  name="imgUpload"
                  id="imgUpload"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleImagen}
                />
              </div>
              {/* Emoji */}
              <div data-role="smile-button" className="relative">
                <FiSmile className="w-8 h-9" onClick={() => handleToggle()} />
                {estaVisiblePicker && (
                  <div className="absolute top-16 lg:left-0 left-[-98px]">
                    <Picker
                      data={data}
                      onEmojiSelect={(e: Skin) => agregarEmoji(e)}
                    />
                  </div>
                )}
              </div>
              {/* Encuesta */}
              <div data-role="chart-button">
                <FiBarChart className="w-9 h-9" onClick={handleOpen} />
                {visibleEncuesta && (
                  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-default">
                    <div className="bg-gray-600 w-[550px] rounded-xl p-6 relative z-50 shadow-lg">
                      <div className="flex items-center justify-between p-2  mb-6 border-b-1">
                        <h3 className="text-xl font-semibold">
                          Crear Encuesta
                        </h3>
                        <button className=" hover:text-gray-300 hover:cursor-pointer">
                          <FiXCircle size={24} onClick={handleOpen} />
                        </button>
                      </div>

                      <div className="mb-12">
                        <input
                          type="text"
                          placeholder="Título de la encuesta"
                          className="w-full p-3 border border-gray-300 rounded-md text-2xl"
                          value={post.encuesta.titulo}
                          onChange={(e) => setTituloEncuesta(e)}
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        {post.encuesta.opciones_encuesta.map(
                          (opcion, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4"
                            >
                              <input
                                value={opcion.texto}
                                type="text"
                                placeholder={`Opción ${index + 1}`}
                                className="w-full p-3 mb-2 border border-gray-300 rounded-md"
                                onChange={(e) => setOpcionesEncuesta(e, index)}
                              />
                              <FiX
                                size={24}
                                onClick={() => eliminarOpcion(index)}
                              />
                            </div>
                          )
                        )}
                      </div>
                      <div className="py-4 space-x-4 text-lg text-gray-200">
                        <label htmlFor="">opción multiple</label>
                        <input
                          type="checkbox"
                          onChange={(e) => setMultipleOpcionesEncuesta(e)}
                        />
                      </div>

                      <div className="flex gap-8">
                        <button
                          className="w-1/2 mt-4 bg-purple-700 text-white py-3 rounded-md hover:bg-purple-600"
                          onClick={agregarOpcion}
                        >
                          AGREGAR OPCION
                        </button>
                        <button
                          type="button"
                          className="w-1/2 mt-4 outline-1 outline-gray-500 text-white py-3 rounded-md hover:bg-gray-400"
                          onClick={guardarEncuesta}
                        >
                          GUARDAR
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="lg:px-9 px-5 py-3 mx-6 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer">
              Postear
            </button>
          </div>
        </form>

        {/* Timeline */}

        <div className="lg:min-w-3xl">
          {timeline.map((post: PostType) => (
            <Post post={post} key={post.id_post} />
          ))}
        </div>

        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default Home;
