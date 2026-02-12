import { useEffect, useState } from "react";
import Nav_left from "../components/nav_left";
import Nav_right from "../components/nav-right";
import { getTokenId } from "../utils/functions";
import Post from "../components/post";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import Menu_mobile from "../components/mobile_menu";
const API_URL = import.meta.env.VITE_API_URL;

function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const userId = getTokenId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/saves/${userId}`);
        const data = await response.json();
        const savedPosts = data.data;

        if (savedPosts) {
          setPosts(savedPosts.reverse());
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="grid grid-cols-12">
      <Nav_left />

      <main className="lg:col-span-7 col-span-12 p-12">
        {posts.length < 1 && (
          <div className="text-center mt-16 space-y-8">
            <h1 className="text-5xl font-bold">No saved posts</h1>
            <h2 className="text-3xl">Save a post to see it here</h2>
          </div>
        )}

        {posts.length >= 1 && (
          <div className="max-w-3xl sm:max-w-4xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <MdArrowBack
                size={28}
                className="cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-3xl font-bold">
                <span>{posts.length} </span> Saved Posts
              </h1>
            </div>

            {posts.map((post) => (
              <Post post={post} key={post.id_post} />
            ))}
          </div>
        )}

        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default Bookmarks;
