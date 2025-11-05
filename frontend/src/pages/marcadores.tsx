import { useEffect, useState } from "react";
import Nav_left from "../components/nav-left";
import Nav_right from "../components/nav-right";
import { obtenerIdToken } from "../utils/functions";
import Post from "../components/post";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import Menu_mobile from "../components/Menu-mobile";
const API_URL = import.meta.env.VITE_API_URL;

function Marcadores() {
  const [posts, setPosts] = useState([]);
  const idUsuario = obtenerIdToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () =>
      fetch(`${API_URL}/api/posts/saves/${idUsuario}`)
        .then((response) => response.json())
        .then((data) => {
          const post = data.data;

          if (post) {
            setPosts(post.reverse());
          }
        });

    fetchPost();
  }, [idUsuario]);
  return (
    <div className="grid grid-cols-12">
      <Nav_left />

      <main className="lg:col-span-7 col-span-12 p-12">
        {posts.length < 1 && (
          <div className="text-center mt-16 space-y-8">
            <h1 className="text-5xl font-bold">No hay posts guardados</h1>{" "}
            <h2 className="text-3xl">Guarda un post para verlo aqui</h2>
          </div>
        )}

        {posts.length >= 1 && (
          <div className="max-w-3xl sm:max-w-4xl w-full">
            <div className="flex items-center gap-4">
              <MdArrowBack
                size={28}
                className="cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-3xl font-bold">
                <span>{posts.length} </span> Posts Guardados
              </h1>
            </div>
            {posts.map((post) => (
              <Post post={post} key={post.id_post} />
            ))}
          </div>
        )}
        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default Marcadores;
