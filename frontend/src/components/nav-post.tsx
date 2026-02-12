import { useEffect, useState } from "react";
// import CopyToClipboard from "react-copy-to-clipboard";
import { AiOutlineDelete } from "react-icons/ai";
import { CiBookmark, CiShare2 } from "react-icons/ci";
import { FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import { SlUserFollow } from "react-icons/sl";
import { checkFollow, toggleFollow } from "../utils/functions";
import { useNavigate } from "react-router";
import { useSocket } from "../hooks/socketContext";
import CopyToClipboard from "react-copy-to-clipboard";

function PostNav({
  isModalVisible,
  post,
  loggedUserId,
  openModal,
  deletePost,
  user,
  toggleSavePost,
  copyToClipboard,
  sharedPost,
}) {
  const [following, setFollowing] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket();

  // Check follow status
  useEffect(() => {
    if (!loggedUserId || !user?.user_id || loggedUserId === user?.user_id)
      return;

    const fetchFollowStatus = async () => {
      const status = await checkFollow(loggedUserId, user.user_id);
      setFollowing(status.follow);
    };
    fetchFollowStatus();
  }, [loggedUserId, user?.user_id]);

  // Socket listener for follow updates
  useEffect(() => {
    if (!socket) return;

    const handleToggleFollow = (data) => {
      if (
        loggedUserId === data.followerId &&
        user.user_id === data.followedId
      ) {
        setFollowing(data.following);
      }
    };

    socket.on("toggle_follow", handleToggleFollow);

    return () => {
      socket.off("toggle_follow", handleToggleFollow);
    };
  }, [socket, loggedUserId, user?.user_id]);

  return (
    <div className="relative">
      <FiMoreHorizontal className="cursor-pointer" onClick={openModal} />
      {isModalVisible && (
        <div className="absolute right-10 top-3 rounded-2xl w-72 py-6 space-y-3 flex flex-col bg-gray-800">
          {/* Options for post owner */}
          {post.user_id === loggedUserId && (
            <div>
              <div
                onClick={() => deletePost(post.post_id)}
                className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500"
              >
                <AiOutlineDelete size={24} />
                <button>Delete Post</button>
              </div>
            </div>
          )}

          {/* Options for other users */}
          {post.user_id !== loggedUserId && (
            <>
              <button
                onClick={() => toggleFollow(loggedUserId, user.user_id, socket)}
                className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500"
              >
                <SlUserFollow size={24} />
                <div>
                  <span>{following ? "Unfollow" : "Follow"}</span> @
                  {user?.username}
                </div>
              </button>

              <div className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500">
                <FiMessageCircle size={24} />
                <button
                  onClick={() =>
                    navigate("/messages", { state: { id: user.user_id } })
                  }
                >
                  <span>Chat with</span> @{user?.username}
                </button>
              </div>
            </>
          )}

          {/* Save post */}
          <div
            onClick={() => toggleSavePost()}
            className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500"
          >
            <CiBookmark size={24} />
            <button>Save</button>
          </div>

          {/* Share post (commented out) */}
          <CopyToClipboard
            text={sharedPost.value}
            onCopy={() => copyToClipboard()}
          >
            <button className="flex items-center space-x-5 cursor-pointer p-5 hover:bg-gray-500">
              <CiShare2 size={24} />
              <span>Share</span>
            </button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export default PostNav;
