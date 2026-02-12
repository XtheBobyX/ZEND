import { calculateTime } from "../utils/functions";
import defaultAvatar from "../../src/assets/img/avatar-default.svg";

function Comment({ comment }) {
  const { user, content, createdAt, id_comment } = comment;
  const { avatar, fullName, username } = user;

  return (
    <div className="border border-white w-full h-40 my-8" key={id_comment}>
      <div className="flex space-x-5 p-5 items-center">
        <img
          src={avatar || defaultAvatar}
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex space-x-3 items-center text-xl">
            <p className="font-bold">{fullName || username}</p>
            <p className="text-gray-300">@{username}</p>
            <p>• {calculateTime(createdAt)}</p>
          </div>
          <p className="text-xl pt-2">{content}</p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
