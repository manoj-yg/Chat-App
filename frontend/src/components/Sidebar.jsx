import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import api from "../axiosConfig";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    messages,
    setMessages,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [latestMessages, setLatestMessages] = useState({}); // {userId: { text, createdAt, isRead }}

  useEffect(() => {
    getUsers();
    fetchLatestMessages();
  }, [getUsers]);

  const fetchLatestMessages = async () => {
    try {
      const res = await api.get("/messages/users", { withCredentials: true });
      const map = {};
      res.data.forEach((user) => {
        const latest = user.latestMessage;
        if (latest) {
          map[user._id] = latest;
        }
      });
      setLatestMessages(map);
    } catch (err) {
      console.error("Failed to fetch latest messages:", err);
    }
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aMsg = latestMessages[a._id];
    const bMsg = latestMessages[b._id];

    const aTime = aMsg ? new Date(aMsg.createdAt).getTime() : 0;
    const bTime = bMsg ? new Date(bMsg.createdAt).getTime() : 0;

    return bTime - aTime;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {sortedUsers.map((user) => {
          const latest = latestMessages[user._id];
          const isUnread =
            latest &&
            latest.senderId !== authUser._id &&
            latest.isRead === false;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate flex items-center justify-between">
                  <span>{user.fullName}</span>
                  {isUnread && <span className="text-xs text-blue-500 ml-2">●</span>}
                </div>
                <div className="text-sm text-zinc-400 truncate max-w-[180px]">
                  {latest?.text || latest?.image ? (latest?.text || "📷 Photo") : " message"}
                </div>
              </div>
            </button>
          );
        })}

        {sortedUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
