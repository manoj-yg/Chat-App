import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import api from "../axiosConfig"; // ✅ added
import toast from "react-hot-toast"; // ✅ added
import { Trash2, CheckCheck } from "lucide-react"; // ✅ added

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Delete message function
  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`, {
        withCredentials: true,
      });
      toast.success("Message deleted");

      // remove message from UI
      useChatStore.setState((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete message");
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col relative group">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}

              {/* ✅ Delete button */}
              {message.senderId === authUser._id && (
                <Trash2
                  onClick={() => handleDeleteMessage(message._id)}
                  className="w-4 h-4 text-red-500 absolute top-1 right-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                />
              )}

              {/* ✅ Read indicator */}
              {message.senderId === authUser._id && message.isRead && (
                <div className="text-right text-xs text-blue-500 mt-1 flex justify-end items-center gap-1">
                  <CheckCheck className="w-4 h-4" />
                  <span>Read</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
