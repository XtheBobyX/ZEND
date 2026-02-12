import React, { useEffect, useState } from "react";
import Nav_left from "../components/nav_left";
import Nav_right from "../components/nav-right";
import Post from "../components/post";

import "../index.css";

import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { FiImage, FiSmile, FiBarChart, FiXCircle, FiX } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";

import { getStyleMultimedia, getUserByID, parseJwt } from "../utils/functions";

import type { MultimediaType, PostType, UserType } from "../utils/interfaces";

import Menu_mobile from "../components/mobile_menu";
import { useSocket } from "../hooks/socketContext";
import EmojiPicker from "emoji-picker-react";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
  const [user, setUser] = useState<UserType>({
    user_id: "",
    username: "",
    email: "",
    full_name: "",
    avatar: "",
    cover: "",
    biography: "",
  });

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

  const [newPost, setNewPost] = useState<PostType>({
    user_id: "",
    content: "",
    is_repost: 0,
    multimedia: [],
    poll: emptyPoll,
    likes: [],
    comments: [],
    reposts: [],
  });

  const [timeline, setTimeline] = useState<PostType[]>([]);

  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isPollVisible, setIsPollVisible] = useState(false);

  const socket: any = useSocket();

  useEffect(() => {
    fetchTimeline();
    setInterval(fetchTimeline, 10000);
  }, []);

  // Fetch timeline posts
  const fetchTimeline = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const posts = await res.json();
      setTimeline(posts.data?.reverse());
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Sockets (Receive and delete post)
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_new_post", (post: PostType) => {
      if (!post || !post.post_id) return;
      setTimeline((prev) => {
        const exists = prev.some((p) => p.post_id === post.post_id);
        if (exists) return prev;
        return [post, ...prev];
      });
    });

    socket.on("delete_post", (id: string) => {
      setTimeline((prev) => prev.filter((p) => p.post_id !== id));
    });
  }, [socket]);

  const deletePollOption = (index: number) => {
    if (newPost.poll.poll_options.length <= 2) {
      alert("Minimum 2 options required");
      return;
    }
    setNewPost((prev) => ({
      ...prev,
      poll: {
        ...prev.poll,
        poll_options: prev.poll.poll_options.filter((_, i) => i !== index),
      },
    }));
  };

  const toggleEmojiPicker = () => setIsEmojiPickerVisible((prev) => !prev);

  const togglePoll = () => {
    if (isPollVisible) {
      // reset poll if closing
      setNewPost((prev) => ({ ...prev, poll: emptyPoll }));
    }
    setIsPollVisible((prev) => !prev);
  };

  const savePoll = () => setIsPollVisible((prev) => !prev);

  const setPollTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPost((prev) => ({
      ...prev,
      poll: { ...prev.poll, title: e.target.value },
    }));

  const setPollMultipleOptions = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPost((prev) => ({
      ...prev,
      poll: { ...prev.poll, multiple_choices: !!e.target.value },
    }));

  const setPollOptionText = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newOptions = [...newPost.poll.poll_options];
    newOptions[index] = { ...newOptions[index], content: e.target.value };

    setNewPost((prev) => ({
      ...prev,
      poll: { ...prev.poll, poll_options: newOptions },
    }));
  };

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = parseJwt(token);
        const user = await getUserByID(payload.user_id);
        setUser(user);
        setNewPost((prev) => ({ ...prev, user_id: user.user_id }));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [user.user_id]);

  // Handle post textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setNewPost((prev) => ({ ...prev, content: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const maxFiles = 4;
    if (!files) return;
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      e.target.value = "";
      return;
    }

    const fileArray = Array.from(files);
    const links: string[] = [];
    let counter = 0;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        links.push(reader.result as string);
        counter++;
        if (counter === fileArray.length) {
          setNewPost((prev) => ({ ...prev, multimedia: links }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const postNewPost = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasContent = newPost.content.trim() !== "";
    const hasImages = newPost.multimedia.length > 0;
    const pollOptions = newPost.poll.poll_options;
    const hasValidPoll =
      newPost.poll.title.trim() !== "" &&
      pollOptions.length >= 2 &&
      pollOptions[0].content.trim() !== "" &&
      pollOptions[1].content.trim() !== "";

    if (!user) return;
    if (!hasContent && !hasImages && !hasValidPoll) return;

    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      setNewPost((prev) => ({
        ...prev,
        content: "",
        multimedia: [],
        poll: emptyPoll,
      }));

      const json = await res.json();

      if (!res.ok) throw new Error("Error posting");

      setIsEmojiPickerVisible(false);
      setIsPollVisible(false);
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!newPost.content) return;
    if (e.key === "Enter") {
      postNewPost(e);
    }
  };

  const removeImage = (index: number) => {
    setNewPost((prev) => ({
      ...prev,
      multimedia: prev.multimedia.filter((_, i) => i !== index) as [],
    }));
  };

  const addEmoji = (emoji: any) => {
    setNewPost((prev) => ({ ...prev, content: prev.content + emoji.emoji }));
  };

  const isPollValid = () => {
    const { title, poll_options } = newPost.poll;
    if (!title.trim()) return false;
    if (poll_options.length < 2) return false;
    return poll_options.slice(0, 2).every((opt) => opt.content.trim() !== "");
  };

  const addPollOption = () => {
    setNewPost((prev) => ({
      ...prev,
      poll: {
        ...prev.poll,
        poll_options: [
          ...prev.poll.poll_options,
          { option_id: "", poll_id: "", content: "" },
        ],
      },
    }));
  };

  return (
    <div className="lg:grid grid-cols-12">
      <Nav_left />

      <main className="p-6 lg:col-span-7 mx-auto">
        <form
          onSubmit={postNewPost}
          className="border border-white w-full rounded-3xl"
        >
          <div className="mx-5 mt-7 gap-6 relative">
            <img
              src={user.avatar || avatarDefault}
              alt=""
              className="w-14 h-14 rounded-full absolute top-1/4 left-8 transform -translate-y-1/3 object-cover"
            />

            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="text-xl border border-white w-full h-44 lg:pl-28 pl-24 pt-7 placeholder:text-gray-300 resize-none pr-2"
            />
          </div>

          {/* Multimedia preview */}
          {newPost.multimedia.length > 0 && (
            <div className="relative w-11/12 ml-5 mt-4">
              <div
                className={`${getStyleMultimedia(newPost.multimedia.length)} border border-gray-500 p-2 gap-8 shadow`}
              >
                {newPost.multimedia.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div
                      className="absolute top-2 right-2 hover:cursor-pointer"
                      onClick={() => removeImage(index)}
                    >
                      <IoIosClose className="w-6 h-6 border rounded-full bg-purple-500 hover:bg-purple-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Poll preview */}
          {isPollValid() && (
            <div className="mx-4 mt-5 border rounded-xl p-2 pl-8">
              <p className="text-2xl py-4">{newPost.poll.title}</p>
              <div className="py-2 cursor-pointer">
                {newPost.poll.poll_options.map((option, index) => (
                  <div
                    key={index}
                    className="border w-10/12 rounded p-3 mb-2 hover:bg-purple-500"
                  >
                    <p className="text-xl">{option.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post buttons */}
          <div className="flex justify-between items-center mt-3 mb-2">
            <div className="ml-10 my-3 flex space-x-4 cursor-pointer">
              <div data-role="image-button">
                <label htmlFor="imgUpload">
                  <FiImage className="w-8 h-9 cursor-pointer" />
                </label>
                <input
                  type="file"
                  id="imgUpload"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleImageUpload}
                />
              </div>
              {/* Emoji */}
              <div data-role="smile-button" className="relative">
                <FiSmile
                  className="w-8 h-9"
                  onClick={() => toggleEmojiPicker()}
                />
                {isEmojiPickerVisible && (
                  <div className="absolute top-16 lg:left-0 left-[-98px]">
                    <EmojiPicker onEmojiClick={(e) => addEmoji(e)} />
                  </div>
                )}
              </div>
              {/* Poll */}
              <div data-role="chart-button">
                <FiBarChart className="w-9 h-9" onClick={togglePoll} />
                {isPollVisible && (
                  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-default">
                    <div className="bg-gray-600 w-[550px] rounded-xl p-6 relative z-50 shadow-lg">
                      <div className="flex items-center justify-between p-2  mb-6 border-b-1">
                        <h3 className="text-xl font-semibold">Create Survey</h3>
                        <button className=" hover:text-gray-300 hover:cursor-pointer">
                          <FiXCircle size={24} onClick={togglePoll} />
                        </button>
                      </div>

                      <div className="mb-12">
                        <input
                          type="text"
                          placeholder="Survey title"
                          className="w-full p-3 border border-gray-300 rounded-md text-2xl"
                          value={newPost.poll.title}
                          onChange={(e) => setPollTitle(e)}
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        {newPost.poll.poll_options.map((option, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <input
                              value={option.content}
                              type="text"
                              placeholder={`Option ${index + 1}`}
                              className="w-full p-3 mb-2 border border-gray-300 rounded-md"
                              onChange={(e) => setPollOptionText(e, index)}
                            />
                            <FiX
                              size={24}
                              onClick={() => deletePollOption(index)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="py-4 space-x-4 text-lg text-gray-200">
                        <label htmlFor="">multiple choice</label>
                        <input
                          type="checkbox"
                          onChange={setPollMultipleOptions}
                        />
                      </div>

                      <div className="flex gap-8 mt-4">
                        <Button
                          type="button"
                          onClick={addPollOption}
                          className="w-1/2 bg-purple-700 hover:bg-purple-600 rounded-md"
                        >
                          ADD OPTION
                        </Button>
                        <Button
                          type="button"
                          onClick={savePoll}
                          className="w-1/2 outline-1 outline-gray-500 hover:bg-gray-400 rounded-md "
                        >
                          SAVE
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button className="lg:px-9 px-5 py-3 mx-6 rounded-full text-xl bg-purple-700 hover:bg-purple-600 cursor-pointer">
              Post
            </button>
          </div>
        </form>

        {/* Timeline */}
        <div className="lg:min-w-3xl">
          {timeline.map((post: PostType) => (
            <Post post={post} key={post.post_id} />
          ))}
        </div>

        <Menu_mobile />
      </main>

      <Nav_right />
    </div>
  );
}

export default HomePage;
