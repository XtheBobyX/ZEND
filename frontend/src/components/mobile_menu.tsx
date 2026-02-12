import {
  FiBookmark,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router";
import { getTokenId, getUserByID } from "../utils/functions";
import { useEffect, useState } from "react";

function MobileMenu() {
  const [user, setUser] = useState({
    userId: 0,
    username: "",
    email: "",
    fullName: "",
    avatar: "",
    cover: "",
    biography: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = await getTokenId();
        const userData = await getUserByID(id);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="lg:hidden fixed left-0 bottom-0 bg-gray-950 p-6 flex w-full justify-between">
      <Link to="/" className="flex gap-2 items-center">
        <FiHome className="w-7 h-7" />
      </Link>
      <Link to="/explore" className="flex gap-2 items-center">
        <FiSearch className="w-7 h-7" />
      </Link>
      <Link to="/messages" className="flex gap-2 items-center">
        <FiMessageSquare className="w-7 h-7" />
      </Link>
      <Link to="/bookmarks" className="flex gap-2 items-center">
        <FiBookmark className="w-7 h-7" />
      </Link>
      <Link to={`/profile/${user.username}`} className="flex gap-2 items-center">
        <FiUser className="w-7 h-7" />
      </Link>
      <button className="flex items-center gap-2" onClick={logOut}>
        <FiLogOut className="w-7 h-7" />
      </button>
    </nav>
  );
}

export default MobileMenu;
