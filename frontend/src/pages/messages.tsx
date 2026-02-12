import { useEffect, useState } from "react";
import NavLeft from "../components/nav_left";
import { getTokenId, getUserByID } from "../utils/functions";
import avatarDefault from "../../src/assets/img/avatar-default.svg";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import { VscSend } from "react-icons/vsc";
import { TbPencilPlus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import MobileMenu from "../components/mobile_menu";
const API_URL = import.meta.env.VITE_API_URL;
import { useSocket } from "../hooks/socketContext";

function Messages() {
  const [userList, setUserList] = useState<any>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [myID, setMyID] = useState(getTokenId());
  const [content, setContent] = useState("");

  const [receiver, setReceiver] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const [userSearch, setUserSearch] = useState([]);
  const [view, setView] = useState(false);

  const location = useLocation();
  const userID = location.state?.id;

  const socket = useSocket();
  const toggleModal = () => setModalOpen((prev) => !prev);

  const fetchUserList = async () => {
    const id = await getTokenId();
    const response = await fetch(`${API_URL}/api/message/list?user=${id}`);
    const json = await response.json();
    setUserList(json.data);
  };

  useEffect(() => {
    setMyID(getTokenId());
    fetchUserList();
  }, []);

  useEffect(() => {
    if (!userID) return;
    openChat(userID);
  }, [userID]);

  const openChat = async (userId: string) => {
    const receiverData = await getUserByID(userId);
    setReceiver(receiverData);

    const response = await fetch(`${API_URL}/api/message/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user1: myID,
        user2: userId,
      }),
    });

    const json = await response.json();
    setMessages(json.data);
    setView(true);
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    const response = await fetch(`${API_URL}/api/message/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: myID,
        receiver_id: receiver?.user_id,
        content: content,
      }),
    });

    const message = await response.json();
    setContent("");

    if (socket) socket.emit("send_message", message.data);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!content) return;
    if (e.key === "Enter") sendMessage();
  };

  const searchUsers = async (text: string) => {
    const response = await fetch(`${API_URL}/api/users/search?query=${text}`);
    const json = await response.json();
    setUserSearch(json.data);
  };

  useEffect(() => {
    if (!socket) return;

    if (myID && receiver) {
      const room = [myID, receiver.user_id].sort().join("-");
      socket.emit("join_room", room);
    }

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      fetchUserList();
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [myID, receiver, socket]);

  return (
    <div className="grid grid-cols-12">
      <NavLeft />

      <main className="lg:col-span-10 col-span-12">
        <div className="grid grid-cols-12">
          {/* Conversation list */}
          <section className="col-span-3 border-r border-gray-500 h-screen pt-10 sticky top-0">
            <div className="border-b border-b-white flex items-center justify-around pb-5">
              <p className="text-2xl font-bold sm:text-xl">Messages</p>
              <TbPencilPlus
                size={32}
                onClick={toggleModal}
                className="cursor-pointer"
              />

              {modalOpen && (
                <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center">
                  <div className="bg-purple-500 p-8 rounded-lg shadow-2xl w-full max-w-xl relative">
                    <div className="flex items-center">
                      <button onClick={toggleModal}>
                        <IoClose size={24} />
                      </button>
                      <h1 className="mx-auto text-xl">Write a message</h1>
                    </div>
                    <input
                      type="text"
                      placeholder="Search user..."
                      className="border w-full p-3 rounded mb-4 mt-8"
                      onChange={(e) => searchUsers(e.target.value)}
                    />

                    {Array.isArray(userSearch) && (
                      <div className="max-h-80 overflow-auto scroll-hide">
                        {userSearch
                          .filter((u: any) => u.user_id !== myID)
                          .map((u: any) => (
                            <div
                              key={u.user_id}
                              onClick={() => {
                                openChat(u.user_id);
                                toggleModal();
                              }}
                              className="border flex space-x-5 p-6"
                            >
                              <img
                                src={u.avatar || avatarDefault}
                                className="w-12 h-12 rounded-full object-cover"
                                alt=""
                              />
                              <div className="flex flex-col">
                                <p>{u.full_name || u.username}</p>
                                <p>@{u.username}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              {userList?.map((chat: any, i) => (
                <div
                  key={i}
                  onClick={() => openChat(chat.user_id)}
                  className="border my-3 p-4 cursor-pointer"
                >
                  <div className="flex items-center space-x-5">
                    <img
                      src={chat.avatar || avatarDefault}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="md:flex flex-col hidden">
                      <p className="font-bold text-xl">
                        {chat.full_name || chat.username}
                      </p>
                      <p className="text-lg text-gray-300">@{chat.username}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chat */}
          <section
            className={`col-span-9 text-center sticky top-0 h-screen ${modalOpen ? "-z-50" : "z-0"}`}
          >
            {!view && (
              <div className="pt-48">
                <h1 className="font-bold text-3xl">No message selected.</h1>
                <h2 className="text-xl pt-8">
                  Choose one of your existing messages or create a new one.
                </h2>
                <button
                  onClick={toggleModal}
                  className="bg-purple-500 p-3 rounded-full mt-8 cursor-pointer hover:bg-purple-700"
                >
                  New Message
                </button>
              </div>
            )}

            {view && (
              <div className="relative h-screen">
                {/* Header */}
                <div className="border-b flex pt-8 pb-4 px-8 items-center space-x-8">
                  <FiArrowLeft
                    className="w-7 h-7 cursor-pointer"
                    size={24}
                    onClick={() => setView((prev) => !prev)}
                  />
                  <div>
                    <Link
                      to={`/profile/${receiver?.username}`}
                      className="cursor-pointer flex flex-col items-start"
                    >
                      <p className="font-bold text-xl">
                        {receiver?.full_name || receiver?.username}
                      </p>
                      <p className="text-lg">@{receiver?.username}</p>
                    </Link>
                  </div>
                </div>

                {/* Messages */}
                <div className="laptop:h-8/12 pc:h-9/12 h-4/7">
                  <div className="h-full overflow-auto pl-18 scroll-hide">
                    {messages.map((c: any, i: number) => (
                      <div
                        key={i}
                        className={`flex px-8 pt-12 ${c.sender_id === myID ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-end gap-6">
                          {c.sender_id != myID && (
                            <img
                              src={c.sender.avatar || avatarDefault}
                              alt=""
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div
                            className={`min-w-20 w-fit min-h-20 max-w-96 flex items-center justify-center relative ${
                              c.sender_id === myID
                                ? "bg-purple-950 rounded-2xl rounded-br-none right-0"
                                : "bg-purple-600 rounded-2xl rounded-bl-none left-0"
                            }`}
                          >
                            <p className="p-2">{c.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-8 lg:mx-0 ml-2">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border rounded-4xl lg:w-3xl md:w-xl h-16 p-8 text-xl mt-2"
                    placeholder="Send a message"
                    onKeyDown={handleEnter}
                  />
                  <VscSend
                    onClick={sendMessage}
                    size={24}
                    className="absolute laptop:right-35 pc:right-60 right-8 top-8"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        <MobileMenu />
      </main>
    </div>
  );
}

export default Messages;
