import { useEffect, useState } from "react";
import Nav_left from "../components/nav_left";
import Nav_right from "../components/nav-right";
import { FiArrowLeft } from "react-icons/fi";
import Post from "../components/post";
import Comment from "../components/comments";
import { getTokenId } from "../utils/functions";
import { useNavigate, useParams } from "react-router";
import Menu_mobile from "../components/mobile_menu";
import { useSocket } from "../hooks/socketContext";
import type { PostType } from "../utils/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

function CommentsPage() {
  const [post, setPost] = useState<PostType>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const { id } = useParams();

  const socket = useSocket();
  const navigate = useNavigate();

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getTokenId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  // Fetch post and comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/id/${id}`);
        const data = await response.json();
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/${id}/comments`);
        const data = await response.json();
        const commentsData = Array.isArray(data.data)
          ? data.data.reverse()
          : [];
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  // Listen for new comments via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (data: any) => {
      setComments((prev) => [data, ...prev]);
    };

    socket.on("receive_comment", handleNewComment);
    return () => {
      socket.off("receive_comment", handleNewComment);
    };
  }, [socket]);

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    try {
      const res = await fetch(`${API_URL}/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content }),
      });

      if (!res.ok) throw new Error("Error posting comment");

      const json = await res.json();
      setContent("");

      if (socket) socket.emit("enviar_comentario", json.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <div className="grid grid-cols-12">
      <Nav_left />

      <main className="col-span-7 p-6 mx-auto">
        <div>
          <div className="flex space-x-5 items-center">
            <FiArrowLeft
              size={24}
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">POST</p>
              <p className="text-lg">
                <span>{comments.length}</span>{" "}
                {comments.length === 1 ? "Comment" : "Comments"}
              </p>
            </div>
          </div>

          <div className="lg:min-w-3xl mt-4">
            {post && <Post post={post} key={id} />}

            <h1 className="text-3xl font-bold mt-16">Comments</h1>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="relative">
                <textarea
                  onChange={handleChange}
                  placeholder="Write a comment..."
                  value={content}
                  className="w-full border border-gray-300 h-36 lg:p-8 p-4 text-2xl resize-none"
                  onKeyDown={handleKey}
                />
                <input
                  type="submit"
                  value="Send"
                  className="px-4 py-2 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer absolute lg:bottom-5 bottom-12 lg:right-8 right-2"
                />
              </div>
            </form>

            {comments.map((comment) => (
              <Comment comment={comment} key={comment.comment_id} />
            ))}
          </div>
        </div>

        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default CommentsPage;
