import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const SearchUser = ({ user }) => {
  const { setSelectedUser } = useChatStore();
  const navigate = useNavigate();

  const handleUserClick = () => {
    setSelectedUser(user); // Set the user in chat store
    navigate("/"); // Navigate to the chat screen (homepage)
  };

  return (
    <div
      className="flex items-center gap-4 p-2 hover:bg-base-300 cursor-pointer rounded-lg"
      onClick={handleUserClick}
    >
      <img
        src={user.profilePic || "/avatar.png"}
        alt={user.fullName}
        className="w-10 h-10 rounded-full object-cover border"
      />
      <div>
        <p className="font-medium">{user.fullName}</p>
        <p className="text-sm text-zinc-500">{user.email}</p>
      </div>
    </div>
  );
};

export default SearchUser;
