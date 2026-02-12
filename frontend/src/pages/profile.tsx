import "../index.css";
import NavLeft from "../components/nav_left";
import NavRight from "../components/nav-right";

import { useEffect, useState } from "react";

import { getUserByID, getUserByUsername, parseJwt } from "../utils/functions";
const API_URL = import.meta.env.VITE_API_URL;

// Icons
import { FiArrowLeft } from "react-icons/fi";
import coverDefault from "../assets/img/background.jpg";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { Link, useNavigate, useParams } from "react-router";
import Post from "../components/post";
import FollowButton from "../components/follow_button";
import MessageIcon from "../components/icon_message";
import MobileMenu from "../components/mobile_menu";
import { useSocket } from "../hooks/socketContext";

function Profile() {
  const { id: username } = useParams();

  const [loggedUser, setLoggedUser] = useState({
    user_id: "",
    username: "",
    email: "",
    full_name: "",
    avatar: "",
    cover: "",
    biography: "",
    createdAt: "",
    updatedAt: "",
  });

  const [profile, setProfile] = useState({
    user_id: "",
    username: "",
    email: "",
    full_name: "",
    avatar: "",
    cover: "",
    biography: "",
    createdAt: "",
    updatedAt: "",
  });

  const [posts, setPosts] = useState([
    {
      post_id: "",
      user_id: "",
      content: "",
      is_repost: "",
      createdAt: "",
      updatedAt: "",
      User: {
        user_id: "",
        username: "",
        email: "",
        full_name: "",
        avatar: "",
        cover: "",
        biography: "",
      },
    },
  ]);

  const isMine = loggedUser.username === username;

  const [following, setFollowing] = useState({ rows: null, count: null });
  const [followers, setFollowers] = useState({ rows: null, count: null });

  // Fetch profile statistics
  const fetchProfileStats = async () => {
    if (!profile.user_id) return;

    const followersRes = await fetch(
      `${API_URL}/api/follow/users/${profile.user_id}/follower`,
    );
    const followersData = await followersRes.json();

    const followingRes = await fetch(
      `${API_URL}/api/follow/users/${profile.user_id}/followed`,
    );
    const followingData = await followingRes.json();

    setFollowers(followersData.data);
    setFollowing(followingData.data);
  };

  useEffect(() => {
    // Get profile by username
    const fetchProfileByUsername = async () => {
      const userProfile = await getUserByUsername(username);
      setProfile(userProfile);
    };
    fetchProfileByUsername();

    fetchProfileStats();
  }, [username, profile.user_id]);

  // Fetch logged-in user data
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
  }, [profile.user_id, loggedUser.user_id]);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!profile.user_id) return;
      const url = `${API_URL}/api/posts/user/${profile.user_id}`;
      try {
        const response = await fetch(url);

        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);

        const result = await response.json();
        const postData = result.data;

        if (postData) setPosts(postData?.reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimeline();
  }, [profile.user_id]);

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (post) => setPosts((prev) => [post, ...prev]);
    const handleDeletePost = (id) =>
      setPosts((prev) => prev.filter((p) => p.post_id !== id));
    const handleToggleFollow = () => fetchProfileStats();

    socket.on("receive_new_post", handleNewPost);
    socket.on("delete_post", handleDeletePost);
    socket.on("toggle_follow", handleToggleFollow);

    return () => {
      socket.off("receive_new_post", handleNewPost);
      socket.off("delete_post", handleDeletePost);
      socket.off("toggle_follow", handleToggleFollow);
    };
  }, [socket, profile.user_id]);

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-12">
      <NavLeft />

      <main className="lg:col-span-7 col-span-12 mx-auto max-w-4xl pb-20">
        <div className="pt-4">
          <div className="flex items-center space-x-6 pl-7">
            <FiArrowLeft
              className="w-7 h-7 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <div>
              <p className="text-2xl font-bold">
                {profile.full_name || profile.username}
              </p>
              <p className="text-xl">
                <span>{posts.length}</span> Post
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src={profile.cover || coverDefault}
              alt=""
              className="mt-6 w-7xl h-68 object-cover"
            />
            <img
              src={profile.avatar || avatarDefault}
              alt=""
              className="w-28 h-28 rounded-full absolute bottom-[-50px] ml-16 object-cover"
            />
          </div>

          <div className="ml-7 mt-20">
            <div className="flex justify-between items-center">
              <div className="ml-12">
                <p className="text-2xl font-bold">
                  {profile.full_name || profile.username}
                </p>
                <p className="text-xl text-gray-300">@{profile.username}</p>
              </div>
              <div className="flex items-center">
                {!isMine && <MessageIcon id={profile.user_id} />}

                {isMine ? (
                  <Link
                    to={`/update-profile`}
                    state={{ username: profile.username }}
                  >
                    <button className="px-6 py-3 mx-6 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer">
                      Edit
                    </button>
                  </Link>
                ) : (
                  <FollowButton
                    followerId={loggedUser.user_id}
                    followedId={profile.user_id}
                  />
                )}
              </div>
            </div>

            <div className="ml-12 mt-5">
              <p className="text-xl">{profile.biography}</p>
            </div>

            {/* Statistics */}
            <div className="flex md:flex-row flex-col space-x-6 mt-4 max-w-3xl mx-auto">
              <Link
                to={`/followed/${profile.username}`}
                className="border mt-5 md:w-1/3 w-full text-center p-4"
              >
                <p className="font-bold text-3xl text-center">
                  {following.count}
                </p>
                <p className="text-2xl">Following</p>
              </Link>
              <Link
                to={`/follower/${profile.username}`}
                className="border mt-5 md:w-1/3 w-full text-center p-4"
              >
                <p className="font-bold text-3xl text-center">
                  {followers.count}
                </p>
                <p className="text-2xl">Followers</p>
              </Link>
              <div className="border mt-5 md:w-1/3 text-center p-4">
                <p className="font-bold text-3xl text-center">
                  <span>{posts.length}</span>
                </p>
                <p className="text-2xl">Posts</p>
              </div>
            </div>

            {posts.length >= 1 &&
              posts.map((post) => (
                <div key={post.post_id} className="max-w-3xl mx-auto w-full">
                  <Post post={post} />
                </div>
              ))}
          </div>
        </div>

        <MobileMenu />
      </main>

      <NavRight />
    </div>
  );
}

export default Profile;
