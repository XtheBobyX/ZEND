import { useEffect, useState } from "react";
import Nav_left from "../components/nav-left";
import Nav_right from "../components/nav-right";
import { FiArrowLeft } from "react-icons/fi";
import Post from "../components/post";
import Comentario from "../components/comentario";
import { obtenerIdToken } from "../utils/functions";
import { useNavigate, useParams } from "react-router";
import Menu_mobile from "../components/Menu-mobile";
import { useSocket } from "../hooks/socketContext";
const API_URL = import.meta.env.VITE_API_URL;
function Comentarios() {
  const [post, setPost] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [contenido, setContenido] = useState("");
  const [id_usuario, setIdUsuario] = useState("");
  const { id } = useParams();

  const socket = useSocket();

  useEffect(() => {
    const getUsuario = async () => {
      const id = await obtenerIdToken();
      setIdUsuario(id);
    };

    getUsuario();

    const fetchPost = async () => {
      const response = await fetch(`${API_URL}/api/posts/id/${id}`);
      const data = await response.json();
      const post = data.data;
      console.log(post);
      setPost(data.data);
    };

    const fetchComentarios = async () => {
      const response = await fetch(`${API_URL}/api/posts/${id}/comentarios`);

      const data = await response.json();
      const comentariosData = data.data;
      const comentarios = Array.isArray(comentariosData)
        ? comentariosData.reverse()
        : [];
      setComentarios(comentarios);
    };

    fetchPost();
    fetchComentarios();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handleComentarios = (data) => {
      setComentarios((prev): any => [data, ...prev]);
    };
    socket.on("recibir_comentario", handleComentarios);

    return () => {
      socket.off("recibir_comentario", handleComentarios);
    };
  }, [socket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: id_usuario,
          contenido: contenido,
        }),
      });

      if (!res.ok) throw new Error("Error al comentar");
      setContenido("");

      const json = await res.json();

      if (!socket) return;
      socket.emit("enviar_comentario", json.data);
    } catch (error) {
      console.error("Error al comentar el post:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setContenido(value);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!contenido) return;
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div className=" grid grid-cols-12">
        <Nav_left />

        <main className="col-span-7 p-6  mx-auto">
          <div>
            <div className="flex space-x-5 items-center">
              <FiArrowLeft
                size={24}
                className="cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <div className="flex flex-col">
                <p className="text-2xl font-bold">POST</p>
                <p className="text-lg">
                  <span>{comentarios.length}</span>{" "}
                  {comentarios.length == 1 ? "Comentario" : "Comentarios"}
                </p>
              </div>
            </div>
            <div className="lg:min-w-3xl">
              <Post post={post} key={id} />

              <h1 className="text-3xl font-bold mt-16">Comentarios</h1>
              <form onSubmit={handleSubmit} className="mt-8 ">
                <div className="relative">
                  <textarea
                    onChange={(e) => handleChange(e)}
                    placeholder="Escribe un comentario ..."
                    value={contenido}
                    className="w-full border border-gray-300 h-36 lg:p-8 p-4 text-2xl resize-none"
                    onKeyDown={handleKey}
                  ></textarea>
                  <input
                    type="submit"
                    value="Enviar"
                    className="px-4 py-2 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer absolute lg:bottom-5 bottom-12 lg:right-8 right-2"
                  />
                </div>
              </form>
              {comentarios.map((comentario) => (
                <Comentario
                  comentario={comentario}
                  key={comentario.id_comentario}
                />
              ))}
            </div>
          </div>
          <Menu_mobile />
        </main>

        <Nav_right />
      </div>
    </>
  );
}

export default Comentarios;
