import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

function IconoMensaje({ id }) {
  const navigate = useNavigate();

  const manejarClick = () => {
    navigate("/mensajes", { state: { id: id } });
  };

  return (
    <div className="border-2 p-2 border-purple-500 rounded-full">
      <FiMail onClick={manejarClick} className="w-8 h-8 cursor-pointer" />
    </div>
  );
}

export default IconoMensaje;
