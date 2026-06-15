import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logout } from "../redux/authSlice";
import { 
  Home, 
  Bookmark, 
  PlusSquare, 
  LogIn, 
  LogOut, 
  User,
  Film
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div id="root">
      {/* Top Header Navigation */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container" onClick={() => navigate("/")}>
            <span className="logo-icon">
              <Film size={28} fill="currentColor" />
            </span>
            <span>Skillcase</span>
            <span className="logo-text-shorts">Shorts</span>
          </div>
        </div>

        <div className="header-right">
          {isAuthenticated ? (
            <>
              <button 
                className="btn-outline" 
                onClick={() => navigate("/upload")}
                style={{ borderRadius: "20px", padding: "6px 12px", fontSize: "13px" }}
              >
                <PlusSquare size={16} />
                <span>Upload</span>
              </button>
              <div className="user-profile-button">
                <User size={16} />
                <span className="uploader-name">{user?.name || "User"}</span>
              </div>
              <button 
                onClick={handleLogout} 
                style={{ color: "#aaaaaa", display: "flex", alignItems: "center" }}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary" style={{ fontSize: "13px", padding: "6px 14px" }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main app container */}
      <div className="app-container">
        {/* Sidebar Nav (Desktop Left Sidebar, Mobile Bottom Bar) */}
        <aside className="app-sidebar">
          <NavLink 
            to="/" 
            className={({ isActive }) => `sidebar-item ${isActive && location.pathname === "/" ? "active" : ""}`}
          >
            <Home />
            <span>Home</span>
          </NavLink>

          <NavLink 
            to="/bookmarks" 
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <Bookmark />
            <span>Saved</span>
          </NavLink>

          <NavLink 
            to="/upload" 
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
          >
            <PlusSquare />
            <span>Upload</span>
          </NavLink>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="sidebar-item" style={{ width: "calc(100% - 8px)" }}>
              <LogOut />
              <span>Sign Out</span>
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
              <LogIn />
              <span>Sign In</span>
            </NavLink>
          )}
        </aside>

        {/* Main Content Render area */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
