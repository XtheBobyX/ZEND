import { useEffect, useState } from "react";
import avatarDefault from "../assets/img/avatar-default.svg";
import { Link } from "react-router";
import { getTokenId, getUserByID } from "../utils/functions";
import type { UserType } from "../utils/interfaces";
import FollowButton from "./follow_button";
import { useSocket } from "../hooks/socketContext";
const API_URL = import.meta.env.VITE_API_URL;

function RightNav() {
  const [topUsers, setTopUsers] = useState<UserType[]>([
    {
      user_id: "",
      avatar: "",
      full_name: "",
      username: "",
    },
  ]);

  const [myUser, setMyUser] = useState<UserType>({
    user_id: "",
    avatar: "",
    full_name: "",
    username: "",
  });

  // Fetch top users
  const fetchTopUsers = async () => {
    const url = `${API_URL}/api/follow/top`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setTopUsers(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTopUsers();
  }, []);

  // Fetch logged-in user
  useEffect(() => {
    const fetchMyUser = async () => {
      try {
        const id = await getTokenId();
        const user = await getUserByID(id);
        setMyUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyUser();
  }, []);

  // Socket listener to refresh top users on follow/unfollow
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    socket.on("toggle_follow", () => {
      fetchTopUsers();
    });

    return () => {
      socket.off("toggle_follow");
    };
  }, [socket]);

  return (
    <div className="w-full hidden lg:block border-l col-span-3 border-gray-500 h-screen sticky top-0">
      <div className="bg-[#18181B] min-h-96 laptop:mx-3 pc:mx-8 mt-8 rounded-2xl">
        <p className="text-2xl text-center pt-8">Top Users</p>
        <div className="mt-8">
          {topUsers?.map((user) => (
            <div
              key={user.user_id}
              className="flex border border-gray-300 rounded-2xl mb-3 p-6 mx-1 justify-between"
            >
              <Link to={`/perfil/${user.username}`} className="flex space-x-4">
                <img
                  src={user.avatar || avatarDefault}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p>{user.full_name || user.username}</p>
                  <p className="text-gray-300 text-sm">@{user.username}</p>
                </div>
              </Link>
              {myUser.username !== user.username && (
                <div className="laptop:ml-12">
                  <FollowButton
                    followerId={myUser.user_id}
                    followedId={user.user_id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightNav;
