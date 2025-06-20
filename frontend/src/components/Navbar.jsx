import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Search } from "lucide-react";
import debounce from "lodash.debounce";
import { useChatStore } from "../store/useChatStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { searchUsers, users, setSelectedUser } = useChatStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearch = ["/login", "/signup"].includes(location.pathname);

  // Debounced search
  const handleSearch = debounce(async (term) => {
    if (!term.trim()) return setShowDropdown(false);
    await searchUsers(term);
    setShowDropdown(true);
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [handleSearch, searchTerm]);

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the selected user in Zustand
    setSearchTerm("");     // Clear the input
    setShowDropdown(false); // Hide dropdown
    navigate("/");         // Go to chat screen
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">CrypTalk</h1>
          </Link>

          {/* Search (hidden on login and signup) */}
          {!hideSearch && (
            <div className="relative w-64">
              <div className="flex items-center border rounded-md bg-base-200 px-2">
                <Search className="w-4 h-4 text-base-content/60" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input input-sm bg-transparent border-none w-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {showDropdown && users.length > 0 && (
                <ul className="absolute z-50 mt-2 bg-base-100 border rounded-lg shadow w-full max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 flex items-center gap-3 hover:bg-base-200 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <img
                        src={user.profilePic || "/avatar.png"}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">{user.fullName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Link to={"/settings"} className="btn btn-sm gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;