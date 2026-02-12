import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

function MessageIcon({ id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/messages", { state: { id } });
  };

  return (
    <div className="border-2 p-2 border-purple-500 rounded-full">
      <FiMail onClick={handleClick} className="w-8 h-8 cursor-pointer" />
    </div>
  );
}

export default MessageIcon;
