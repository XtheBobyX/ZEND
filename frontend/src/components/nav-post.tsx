import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { AiOutlineDelete } from "react-icons/ai";
import { CiBookmark, CiShare2 } from "react-icons/ci";
import { FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import { SlUserFollow } from "react-icons/sl";
import { tieneFollow, toggleFollow } from "../utils/functions";
import { useNavigate } from "react-router";
import { useSocket } from "../hooks/socketContext";

function Nav_post({
  visibleModal,
  post,
  idLogueado,
  openModal,
  deletePost,
  usuario,
  toggleSavePost,
  copiarPortapapeles,
  sharedPost,
}) {
  const [leSigo, setLeSigo] = useState(null);
  useEffect(() => {
    if (!idLogueado || !usuario?.id_usuario) return;

    const x = async () => {
      const status = await tieneFollow(idLogueado, usuario.id_usuario);
      setLeSigo(status.follow);
    };
    x();
  }, [idLogueado, usuario?.id_usuario]);

  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleToggleFollow = (data) => {
      if (
        idLogueado === data.id_seguidor &&
        usuario.id_usuario === data.id_seguido
      ) {
        setLeSigo(data.leSigo);
      }
    };

    socket.on("toggle_follow", handleToggleFollow);

    return () => {
      socket.off("toggle_follow", handleToggleFollow);
    };
  }, [socket, idLogueado, usuario?.id_usuario]);

  return (
    <>
      <div className="relative">
        <FiMoreHorizontal className="cursor-pointer" onClick={openModal} />
        {visibleModal && (
          <div className="absolute right-10 top-3 rounded-2xl w-72 py-6 space-y-3 flex flex-col bg-gray-800">
            {post.id_usuario === idLogueado && (
              <div>
                <div
                  onClick={() => deletePost(post.id_post)}
                  className="flex items-center space-x-5  cursor-pointer p-5 hover:bg-gray-500"
                >
                  <AiOutlineDelete size={24} />
                  <button>Eliminar Post</button>
                </div>
                {/* <div className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500">
                  <FiEdit2 size={24} />
                  <button>Editar</button>
                </div> */}
              </div>
            )}
            {post.id_usuario !== idLogueado && (
              <>
                <button
                  onClick={() =>
                    toggleFollow(idLogueado, usuario.id_usuario, socket)
                  }
                  className="flex items-center space-x-5  cursor-pointer p-5 hover:bg-gray-500"
                >
                  <SlUserFollow size={24} />
                  <div>
                    <span>{leSigo ? "Dejar seguir" : "Seguir"}</span> a @
                    {usuario?.username}
                  </div>
                </button>
                <div
                  onClick={() =>
                    toggleFollow(idLogueado, usuario.id_usuario, socket)
                  }
                  className="flex items-center space-x-5  cursor-pointer p-5 hover:bg-gray-500"
                >
                  <FiMessageCircle size={24} />
                  <button
                    onClick={() => {
                      navigate("/mensajes", {
                        state: { id: usuario.id_usuario },
                      });
                    }}
                  >
                    <span>Chatear con</span> @{usuario?.username}
                  </button>
                </div>
              </>
            )}

            <div
              onClick={() => toggleSavePost()}
              className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500"
            >
              <CiBookmark size={24} />
              <button>Guardar</button>
            </div>

            <CopyToClipboard
              text={sharedPost.value}
              onCopy={() => copiarPortapapeles()}
            >
              <button className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500">
                <CiShare2 size={24} />
                <span>Compartir</span>
              </button>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </>
  );
}

export default Nav_post;
