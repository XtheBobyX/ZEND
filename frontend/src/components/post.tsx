import avatarDefault from "../../src/assets/img/avatar-default.svg";
import type { PostType } from "../utils/interfaces";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiShare,
  FiRepeat,
} from "react-icons/fi";
import {
  calculateTime,
  getStyleMultimedia,
  getTokenId,
} from "../../src/utils/functions";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import PostMenu from "./nav-post";
import { useSocket } from "../hooks/socketContext";
import clsx from "clsx";
import CopyToClipboard from "react-copy-to-clipboard";
const API_URL = import.meta.env.VITE_API_URL;

function Post({ post, show = true }: { post: PostType; show?: boolean }) {
  const isRepost = Boolean(post.is_repost);

  const [hasLike, setHasLike] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const baseURL = window.location.origin;
  const [sharedPost, setSharedPost] = useState({
    value: `${baseURL}/${post.user?.username}/post/${post.post_id}`,
    copied: false,
  });

  const multimedia = post.multimedia || [];
  const user = post.user;
  const poll = post.poll;
  const likes = post.likes || [];

  const [likesCount, setLikesCount] = useState(likes.length || 0);

  useEffect(() => {
    if (post.likes) setLikesCount(post.likes.length);
  }, [post.likes]);

  const loggedInUserId = getTokenId();

  // Fetch like & save status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        if (!post.post_id) return;
        const res = await fetch(
          `${API_URL}/api/posts/${post.post_id}/like?user=${loggedInUserId}`,
        );
        const data = await res.json();
        setHasLike(data.hasLike);
      } catch (error) {
        console.error("Error fetching like status", error);
      }
    };

    const fetchSaveStatus = async () => {
      try {
        if (!post.post_id) return;
        const res = await fetch(
          `${API_URL}/api/posts/${post.post_id}/save?user=${loggedInUserId}`,
        );
        const data = await res.json();
        setHasSave(data.hasSaved);
      } catch (err) {
        console.error("Error checking save status:", err);
      }
    };

    fetchLikeStatus();
    fetchSaveStatus();

    if (poll) checkPollVotes();
  }, [post.post_id, loggedInUserId, poll]);

  const [votes, setVotes] = useState<number[]>([]);

  interface optionVotes {
    option_id: number;
  }
  const checkPollVotes = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/poll/hasVoted?user=${loggedInUserId}`,
      );
      const json = await res.json();
      if (json.success) {
        const ids = json.data.map((option: optionVotes) => option.option_id);
        setVotes(ids);
      }
    } catch (error) {
      console.error("Error checking user votes", error);
    }
  };

  // LIKE functionality
  const socket = useSocket();
  const toggleLike = async () => {
    try {
      if (!post.post_id) return;
      const newState = !hasLike;

      await fetch(`${API_URL}/api/posts/${post.post_id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedInUserId }),
      });

      setHasLike(newState);

      if (socket) {
        socket.emit("toggle_like", { post_id: post.post_id, state: newState });
      }
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  interface ToggleLikeData {
    post_id: string;
    state: boolean;
  }

  useEffect(() => {
    if (!socket) return;

    const handler = (data: ToggleLikeData) => {
      if (post.post_id !== data.post_id) return;
      setLikesCount((prev) => (data.state ? prev + 1 : prev - 1));
    };

    socket.on("toggle_like", handler);

    return () => {
      socket.off("toggle_like", handler);
    };
  }, [socket, post.post_id]);

  const toggleSavePost = async () => {
    try {
      await fetch(`${API_URL}/api/posts/${post.post_id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: loggedInUserId }),
      });
      setHasSave((prev) => !prev);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  // REPOST
  const emptyPoll = {
    poll_id: "",
    post_id: "",
    title: "",
    multiple_choices: false,
    poll_options: [
      { option_id: "", poll_id: "", content: "" },
      { option_id: "", poll_id: "", content: "" },
    ],
  };

  const [repostData, setRepostData] = useState<PostType>({
    user_id: "",
    content: "",
    is_repost: 0,
    multimedia: [],
    poll: emptyPoll,
    likes: [],
    comments: [],
    reposts: [],
  });
  const repost = async () => {
    if (!post.is_repost) {
      await fetch(
        `${API_URL}/api/posts/${post.post_id}/repost?user=${loggedInUserId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  };

  // SHARE
  const copyToClipboard = () => {
    setSharedPost((prev) => ({ ...prev, copied: true }));
    setTimeout(
      () => setSharedPost((prev) => ({ ...prev, copied: false })),
      2000,
    );
  };

  // DELETE
  const deletePost = async (id: number) => {
    await fetch(`${API_URL}/api/posts/id/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (socket) socket.emit("delete_post", id);
  };

  // POLL voting
  const [isVoting, setIsVoting] = useState(false);

  const vote = async (pollId: string, optionId: string) => {
    if (isVoting) return;
    setIsVoting(true);
    try {
      const res = await fetch(`${API_URL}/api/poll/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: pollId,
          option_id: optionId,
          user_id: loggedInUserId,
        }),
      });
      const data = await res.json();

      if (!data.success) console.warn(data.msg);
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (isRepost) {
      const fetchOriginalPost = async () => {
        const res = await fetch(
          `${API_URL}/api/posts/id/${post.original_post_id}`,
        );
        const data = await res.json();
        setRepostData(data.data);
      };
      fetchOriginalPost();
    }
  }, [isRepost, post.original_post_id]);

  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible((prev) => !prev);

  const handleCheckboxChange = (optionId: number) => {
    if (votes.includes(optionId))
      setVotes(votes.filter((id) => id !== optionId));
    else setVotes([...votes, optionId]);
  };

  const handleRadioChange = (optionId: number) => {
    setVotes([optionId]);
  };

  return (
    <>
      {isRepost && repostData && (
        <div
          className="mt-4 border border-gray-400 rounded-xl p-4"
          key={post.post_id}
        >
          {/* Repost header */}
          <div className="flex space-x-5 items-center">
            <img
              src={user?.avatar || avatarDefault}
              className="w-14 h-14 rounded-full object-cover mt-2 mr-3"
            />
            <div className="flex items-center space-x-5 mb-3 justify-between w-full">
              <div className="flex">
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex space-x-2 hover:underline"
                >
                  <p className="font-bold text-white">
                    {user?.full_name || user?.username}
                  </p>
                  <p>@{user?.username}</p>
                </Link>
                <p> • {calculateTime(post.created_at)}</p>
              </div>
              <div className="relative">
                <PostMenu
                  isModalVisible={modalVisible}
                  post={post}
                  loggedUserId={loggedInUserId}
                  deletePost={deletePost}
                  openModal={openModal}
                  copyToClipboard={copyToClipboard}
                  sharedPost={sharedPost}
                  user={user}
                  toggleSavePost={toggleSavePost}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-2 pl-17 mt-[-20px]">
            @{user?.username} has reposted
          </p>

          <div className="w-11/12 mx-auto">
            <Post post={repostData} show={false} />
          </div>

          {/* Interactions */}
          <div className="flex items-center justify-between pl-19 pt-7 px-2 text-gray-300">
            <div className="flex items-center gap-2">
              <FiHeart
                onClick={toggleLike}
                className={clsx(
                  "w-6 h-6 cursor-pointer hover:text-red-500 transition",
                  hasLike && "fill-red-500 text-red-500",
                )}
              />
              <span className="text-xl">{likesCount}</span>
            </div>
            <div>
              <Link
                to={`/${user?.username}/post/${post.post_id}`}
                className="flex items-center gap-2"
              >
                <FiMessageCircle className="w-6 h-6 cursor-pointer hover:text-blue-400 transition" />
                <span className="text-xl">{post.comments?.length}</span>
              </Link>
            </div>
            <div onClick={repost} className="flex items-center gap-2">
              <FiRepeat className="w-6 h-6 cursor-pointer hover:text-green-400 transition" />
              <span className="text-xl">{post.reposts?.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBookmark
                onClick={toggleSavePost}
                className={clsx(
                  "w-6 h-6 cursor-pointer hover:text-yellow-400 transition",
                  hasSave && "fill-yellow-400 text-yellow-400",
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <CopyToClipboard
                text={sharedPost.value}
                onCopy={() => copyToClipboard()}
              >
                <FiShare className="w-6 h-6 cursor-pointer hover:text-purple-400 transition" />
              </CopyToClipboard>
              {sharedPost.copied ? (
                <span style={{ color: "green" }}>Copiado!</span>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {!isRepost && (
        <div className="w-full max-w-3xl border border-white mt-10 rounded-xl p-5 shadow-2xl">
          {/* Post header */}
          <div className="w-full flex items-start">
            <img
              src={user?.avatar || avatarDefault}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover mt-2 mr-3"
            />
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between text-lg text-gray-300">
                <div className="flex items-center space-x-5">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex md:flex-row flex-col space-x-5 hover:underline"
                  >
                    <p className="font-bold text-white">
                      {user?.full_name || user?.username}
                    </p>
                    <p>@{user?.username}</p>
                  </Link>
                  <p> • {calculateTime(post.created_at)}</p>
                </div>
                {show && (
                  <div className="relative">
                    <PostMenu
                      isModalVisible={modalVisible}
                      post={post}
                      loggedUserId={loggedInUserId}
                      deletePost={deletePost}
                      openModal={openModal}
                      copyToClipboard={copyToClipboard}
                      sharedPost={sharedPost}
                      user={user}
                      toggleSavePost={toggleSavePost}
                    />
                  </div>
                )}
              </div>

              <p className="text-lg break-words max-w-2xl">{post.content}</p>
            </div>
          </div>

          {/* Poll */}
          {poll && (
            <div className="mt-5 border rounded-xl p-2 pl-8">
              <p className="text-2xl py-4">{poll.title}</p>
              <div className="py-2">
                {poll.poll_options.map((option) => (
                  <div
                    className="flex items-center space-x-10 cursor-pointer"
                    key={option.option_id}
                    onClick={() => vote(poll.poll_id, option.option_id)}
                  >
                    <label
                      htmlFor={`${option.option_id}`}
                      className={`border w-10/12 rounded p-3 mb-2 cursor-pointer ${
                        votes.includes(Number(option.option_id))
                          ? "bg-purple-500"
                          : ""
                      }`}
                    >
                      <span className="text-xl">{option.content}</span>
                    </label>
                    {poll.multiple_choices ? (
                      <input
                        type="checkbox"
                        checked={votes.includes(Number(option.option_id))}
                        onChange={() =>
                          handleCheckboxChange(Number(option.option_id))
                        }
                        id={`${option.option_id}`}
                        className="w-4 h-4 cursor-pointer"
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={votes.includes(Number(option.option_id))}
                        onChange={() =>
                          handleRadioChange(Number(option.option_id))
                        }
                        name={`vote-${poll.poll_id}`}
                        id={`${option.option_id}`}
                        className="w-4 h-4 cursor-pointer"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multimedia */}
          {multimedia.length > 0 && (
            <div
              className={`mt-8 w-full ${getStyleMultimedia(post.multimedia.length)}`}
            >
              {post.multimedia.map((img, index) => (
                <img
                  key={index}
                  src={img.file_url}
                  className={`object-cover w-full max-h-64 rounded-2xl ${
                    post.multimedia.length === 3 && index === 2
                      ? "col-span-2"
                      : ""
                  }`}
                />
              ))}
            </div>
          )}

          {/* Interactions */}
          {show && (
            <div className="flex items-center justify-between md:pl-19 pl-0 space-x-5 pt-7 px-2 text-gray-300">
              <div className="flex items-center gap-2">
                <FiHeart
                  onClick={toggleLike}
                  className={`w-7 h-7 cursor-pointer hover:text-red-500 transition ${
                    hasLike ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="text-xl">{likesCount}</span>
              </div>
              <div>
                <Link
                  to={`/${user?.username}/post/${post.post_id}`}
                  className="flex items-center gap-2"
                >
                  <FiMessageCircle className="w-7 h-7 cursor-pointer hover:text-blue-400 transition" />
                  <span className="text-xl">{post.comments?.length}</span>
                </Link>
              </div>
              <div onClick={repost} className="flex items-center gap-2">
                <FiRepeat className="w-7 h-7 cursor-pointer hover:text-green-400 transition" />
                <span className="text-xl">{post.reposts?.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiBookmark
                  onClick={toggleSavePost}
                  className={`w-7 h-7 cursor-pointer hover:text-yellow-400 transition ${
                    hasSave ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                {sharedPost.copied && (
                  <span style={{ color: "green" }}>Copied!</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Post;
