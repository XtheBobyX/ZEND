import { FiArrowLeft } from "react-icons/fi";
import Nav_left from "../components/nav_left";
import Nav_right from "../components/nav-right";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getUserByID, getUserByUsername, parseJwt } from "../utils/functions";
import Follow_Button from "../components/follow_button";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import MessageIcon from "../components/icon_message";
import Menu_mobile from "../components/mobile_menu";
import type { UserType } from "../utils/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

function FollowsPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // username from URL
  const location = useLocation();

  const initialType = location.pathname.includes("follower")
    ? "follower"
    : "followed";
  const [type, setType] = useState(initialType);

  const [users, setUsers] = useState<any[]>([]);
  const [loggedUser, setLoggedUser] = useState({
    user_id: "",
    username: "",
    email: "",
    full_name: "",
    avatar: "",
    cover: "",
    biography: "",
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    setType(initialType);

    // Get logged-in user
    const fetchLoggedUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = parseJwt(token);
        const userId = payload.user_id;
        const user = await getUserByID(userId);
        setLoggedUser(user);
      }
    };

    // Fetch followers or following
    const fetchFollowUsers = async () => {
      const user = await getUserByUsername(id);
      const endpointType = initialType === "follower" ? "follower" : "followed";

      const response = await fetch(
        `${API_URL}/api/follow/users/${user.user_id}/${endpointType}`,
      );
      const data = await response.json();
      setUsers(data.data.rows || []);
    };

    fetchLoggedUser();
    fetchFollowUsers();
  }, [id, initialType]);

  return (
    <div className="grid grid-cols-12">
      <Nav_left />
      <main className="lg:col-span-7 col-span-12 p-6">
        <div className="flex items-center space-x-5">
          <FiArrowLeft
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${id}`)}
          />
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">{id}</h1>
            <p className="text-lg">
              {users.length}{" "}
              <span>
                {type === "followers"
                  ? users.length === 1
                    ? "Follower"
                    : "Followers"
                  : "Following"}
              </span>
            </p>
          </div>
        </div>

        <nav className="flex justify-between gap-12 text-xl mt-8">
          <Link
            to={`/follower/${id}`}
            className={`${
              initialType === "follower" ? "border-b-4 border-b-purple-600" : ""
            } w-full text-center pb-4`}
          >
            Followers
          </Link>
          <Link
            to={`/followed/${id}`}
            className={`${
              initialType !== "follower" ? "border-b-4 border-b-purple-600" : ""
            } w-full text-center`}
          >
            Following
          </Link>
        </nav>

        <section className="mt-6">
          {users.map((userItem) => {
            const u: UserType =
              initialType === "follower"
                ? userItem.follower
                : userItem.followed;

            if (!u) return null;
            return (
              <div
                key={u.user_id}
                className="border flex justify-between p-4 mt-2"
              >
                <div className="flex space-x-5">
                  <img
                    src={u.avatar || avatarDefault}
                    className="w-18 h-18 object-cover rounded-full"
                  />
                  <Link
                    to={`/profile/${u?.username}`}
                    className="flex flex-col"
                  >
                    <p className="text-xl font-bold">
                      {u.full_name || u.username}
                    </p>
                    <p className="text-gray-300">@{u.username}</p>
                  </Link>
                </div>

                {loggedUser.user_id !== u.user_id && (
                  <div className="flex md:flex-row flex-col space-y-2 items-center">
                    <MessageIcon id={u.user_id} />
                    <Follow_Button
                      followerId={loggedUser.user_id}
                      followedId={u.user_id}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <Menu_mobile />
      </main>
      <Nav_right />
    </div>
  );
}

export default FollowsPage;
