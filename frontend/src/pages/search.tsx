import { Link, useNavigate } from "react-router";
import Nav_left from "../components/nav_left";
import Nav_right from "../components/nav-right";
import { IoIosSearch } from "react-icons/io";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import Follow_Button from "../components/follow_button";
import { getUserByID, parseJwt } from "../utils/functions";
import Post from "../components/post";
import IconoMensaje from "../components/icon_message";
import Menu_mobile from "../components/mobile_menu";
const API_URL = import.meta.env.VITE_API_URL;

function Search() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("users");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loggedUser, setLoggedUser] = useState({
    user_id: "",
    username: "",
    email: "",
    full_name: "",
    avatar: "",
    portada: "",
    biografia: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchLoggedUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = parseJwt(token);
        const userId = payload.user_id;
        const user = await getUserByID(userId);
        setLoggedUser(user);
      }
    };

    fetchLoggedUser();

    if (!query) return;

    const fetchResults = async () => {
      if (selectedOption === "users") {
        const res = await fetch(`${API_URL}/api/users/search?query=${query}`);
        const json = await res.json();
        setResults(json.data);
      } else {
        const res = await fetch(`${API_URL}/api/posts/search?query=${query}`);
        const json = await res.json();
        setResults(json.data);
      }
    };

    fetchResults();
  }, [selectedOption, query]);

  return (
    <div className="grid grid-cols-12">
      <Nav_left />

      <main className="lg:col-span-7 col-span-12 p-6">
        <div className="flex items-center space-x-6 pl-7">
          <FiArrowLeft
            className="w-7 h-7 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div>
            <p className="text-2xl font-bold">Explore</p>
          </div>
        </div>

        <form className="relative pl-7 mt-8">
          <div className="flex">
            <select
              className="border border-gray-500 lg:w-4/12 pl-2 py-4 px-6 text-xl rounded-xl bg-purple-600 shadow-2xl"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="users">Users</option>
              <option value="posts">Posts</option>
            </select>

            <input
              type="search"
              onChange={(e) => setQuery(e.target.value)}
              name="query"
              id="query"
              placeholder="Search for a user or a post"
              className="border border-purple-600 shadow-2xl pl-4 ml-8 w-full rounded-xl lg:pl-3 text-xl"
            />
          </div>
          <IoIosSearch
            size={32}
            className="absolute lg:right-8 right-2 top-1/5"
          />
        </form>

        <div className="md:pl-7 mt-12 space-y-8">
          {Array.isArray(results) &&
            results.length > 0 &&
            selectedOption === "users" &&
            results.map((user: any) => (
              <div
                key={user.user_id}
                className="border rounded space-y-5 py-4 flex md:pl-8 pl-4 justify-between"
              >
                <div className="flex space-x-5">
                  <img
                    src={user.avatar || avatarDefault}
                    className="lg:w-18 lg:h-18 w-12 h-12 object-cover rounded-full"
                  />
                  <Link
                    to={`/profile/${user.username}`}
                    className="flex flex-col pt-2.5 cursor-pointer items-start"
                  >
                    <p className="font-bold text-lg">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-gray-300 text-sm">@{user.username}</p>
                  </Link>
                </div>

                {user.user_id !== loggedUser.user_id && (
                  <div className="flex items-center px-4">
                    <Follow_Button
                      followerId={user.user_id}
                      followedId={loggedUser.user_id}
                    />
                    <IconoMensaje id={user.user_id} />
                  </div>
                )}
              </div>
            ))}

          {Array.isArray(results) &&
            results.length >= 1 &&
            selectedOption === "posts" &&
            results.map((post: any) => <Post post={post} key={post.id_post} />)}
        </div>

        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default Search;
