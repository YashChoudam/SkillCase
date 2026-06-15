import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { Bookmark, Play, Heart } from "lucide-react";
import { API_BASE_URL } from "../api/axiosConfig";

export const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { videos, bookmarkedVideoIds } = useAppSelector((state) => state.video);

  const bookmarkedVideos = videos.filter((video) => !!bookmarkedVideoIds[video.id]);

  const handlePlayVideo = (id: number) => {
    // Navigate back to home feed with a target video (future enhancement can scroll to it, or simple redirect)
    navigate("/", { state: { scrollToId: id } });
  };

  return (
    <div className="flex flex-column w-full h-full" style={{ overflowY: "auto", paddingBottom: "40px" }}>
      <div style={{ padding: "24px 24px 8px 24px" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", fontSize: "22px", fontWeight: "500" }}>
          <Bookmark size={24} fill="white" />
          <span>Saved Shorts</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Your bookmarked lessons and educational shorts.
        </p>
      </div>

      {bookmarkedVideos.length === 0 ? (
        <div className="empty-container" style={{ flex: 1, padding: "80px 24px" }}>
          <Bookmark size={48} color="var(--text-secondary)" />
          <h3 style={{ color: "white", fontSize: "16px", marginTop: "16px" }}>No Saved Videos</h3>
          <p style={{ maxWidth: "300px", margin: "8px auto" }}>
            Explore the home feed and click the bookmark button on any short to save it here.
          </p>
          <button className="btn-primary" onClick={() => navigate("/")} style={{ marginTop: "16px" }}>
            Explore Feed
          </button>
        </div>
      ) : (
        <div className="grid-container">
          {bookmarkedVideos.map((video) => {
            const cleanPath = video.file_path.startsWith("/") ? video.file_path.slice(1) : video.file_path;
            const fullVideoUrl = video.file_path.startsWith("http") 
              ? video.file_path 
              : `${API_BASE_URL}/${cleanPath}`;

            return (
              <div 
                key={video.id} 
                className="grid-video-card"
                onClick={() => handlePlayVideo(video.id)}
              >
                <div className="grid-video-thumbnail">
                  {/* Miniature video element as preview thumbnail */}
                  <video src={fullVideoUrl} muted playsInline preload="metadata" />
                  <span className="grid-video-badge">{video.category}</span>
                  
                  {/* Hover play button icon */}
                  <div 
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                    className="hover-play-overlay"
                  >
                    <Play size={32} fill="white" color="white" />
                  </div>
                </div>
                
                <div className="grid-video-info">
                  <h4 className="grid-video-title" title={video.title}>{video.title}</h4>
                  <p className="grid-video-description">{video.description}</p>
                  <div className="grid-video-meta">
                    <Heart size={12} fill="currentColor" />
                    <span>{video.like_count} Likes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Bookmarks;
