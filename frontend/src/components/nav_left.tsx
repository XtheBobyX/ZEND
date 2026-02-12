import { Link } from "react-router";
import zendLogo from "../assets/img/zend-logo.svg";
import { useEffect, useState } from "react";
import avatarDefault from "../../src/assets/img/avatar-default.svg";

// Icons
import {
  FiHome,
  FiSearch,
  FiMessageSquare,
  FiBookmark,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { getTokenId, getUserByID } from "../utils/functions";

function LeftNav() {
  const [user, setUser] = useState({
    userId: 0,
    username: "",
    email: "",
    full_name: "",
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
    <div className="hidden lg:block col-span-2 laptop:p-8 pc:p-12 border-r border-gray-500 h-screen sticky top-0">
      <img src={zendLogo} alt="App Logo" className="w-14 h-14" />
      <nav className="flex flex-col laptop:mt-10 pc:mt-18 gap-12 text-xl">
        <Link to="/" className="flex gap-2 items-center">
          <FiHome className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link to="/explore" className="flex gap-2 items-center">
          <FiSearch className="w-6 h-6" />
          Explore
        </Link>
        <Link to="/messages" className="flex gap-2 items-center">
          <FiMessageSquare className="w-6 h-6" />
          Messages
        </Link>
        <Link to="/bookmarks" className="flex gap-2 items-center">
          <FiBookmark className="w-6 h-6" />
          Bookmarks
        </Link>
        <Link
          to={`/profile/${user.username}`}
          className="flex gap-2 items-center"
        >
          <FiUser className="w-6 h-6" />
          Profile
        </Link>
        <button className="flex items-center gap-2" onClick={logOut}>
          <FiLogOut className="w-6 h-6" />
          Log Out
        </button>

        <div className="border mt-6 w-full max-w-full p-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={user.avatar || avatarDefault}
              alt=""
              className="w-14 h-14 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <p className="font-bold">{user.full_name || user.username}</p>
              <p className="text-sm text-gray-200">@{user.username}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default LeftNav;
