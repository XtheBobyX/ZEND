import { useEffect, useState } from "react";
import { tieneFollow, toggleFollow } from "../utils/functions";
import { useSocket } from "../hooks/socketContext";

function Boton_Seguir({ idSeguidor, idSeguido }) {
  const [leSigo, setLeSigo] = useState();
  const socket = useSocket();

  useEffect(() => {
    if (!idSeguido || !idSeguidor) return;

    const getFollow = async () => {
      const x = await tieneFollow(idSeguidor, idSeguido);
      setLeSigo(await x.follow);
    };

    getFollow();
  }, [idSeguido, idSeguidor]);

  useEffect(() => {
    if (!socket) return;

    const handleToggleFollow = (data) => {
      if (idSeguidor === data.id_seguidor && idSeguido === data.id_seguido) {
        setLeSigo(data.leSigo);
      }
    };

    socket.on("toggle_follow", handleToggleFollow);

    return () => {
      socket.off("toggle_follow", handleToggleFollow);
    };
  }, [socket, idSeguidor, idSeguido]);

  return (
    <button
      onClick={() => toggleFollow(idSeguidor, idSeguido, socket)}
      className="md:px-6 px-3 md:py-4 py-3 mx-4  rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer"
    >
      <p>{leSigo ? "Siguiendo" : "Seguir"}</p>
    </button>
  );
}

export default Boton_Seguir;
