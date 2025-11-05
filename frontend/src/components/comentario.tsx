import { calcularTiempo } from "../utils/functions";
import avatarDefault from "../../src/assets/img/avatar-default.svg";

function Comentario({ comentario }) {
  const { usuario, contenido, createdAt, id_comentario } = comentario;
  const { avatar, nombre_completo, username } = usuario;

  return (
    <div className="border border-white w-full h-40 my-8" key={id_comentario}>
      <div className="flex space-x-5 p-5 items-center">
        <img
          src={avatar || avatarDefault}
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex space-x-3 items-center text-xl">
            <p className="font-bold">{nombre_completo || username}</p>
            <p className="text-gray-300">@{username}</p>
            <p>• {calcularTiempo(createdAt)}</p>
          </div>
          <p className="text-xl pt-2">{contenido}</p>
        </div>
      </div>
    </div>
  );
}

export default Comentario;
