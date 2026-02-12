import { useEffect, useState } from "react";
import { checkFollow, toggleFollow } from "../utils/functions";
import { useSocket } from "../hooks/socketContext";

function FollowButton({ followerId, followedId }) {
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>();
  const socket = useSocket();

  // Check if following on mount or when IDs change
  useEffect(() => {
    if (!followedId || !followerId) return;

    const fetchFollowStatus = async () => {
      const result = await checkFollow(followerId, followedId);
      setIsFollowing(result);
    };

    fetchFollowStatus();
  }, [followedId, followerId]);

  // Listen for follow toggle events from socket
  useEffect(() => {
    if (!socket) return;

    interface dataToggleFollow {
      follower_id: number;
      followed_id: number;
      isFollowing: boolean;
    }

    const handleToggleFollow = (data: dataToggleFollow) => {
      if (followerId === data.follower_id && followedId === data.followed_id) {
        setIsFollowing(data.isFollowing);
      }
    };

    socket.on("toggle_follow", handleToggleFollow);

    return () => {
      socket.off("toggle_follow", handleToggleFollow);
    };
  }, [socket, followerId, followedId]);

  return (
    <button
      onClick={() => toggleFollow(followerId, followedId, socket)}
      className="md:px-6 px-3 py-3 mx-4 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer"
    >
      <p>{isFollowing ? "Following" : "Follow"}</p>
    </button>
  );
}

export default FollowButton;
