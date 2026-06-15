import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchVideos } from "../redux/videoSlice";
import ShortsCard from "../components/ShortsCard";
import CategoryChips from "../components/CategoryChips";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { Play } from "lucide-react";

export const Feed: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const state = location.state as { scrollToId?: number } | null;

  const { videos, activeCategory, loading, error } = useAppSelector((state) => state.video);
  const { activeId, registerElement, updateObservedElements } = useIntersectionObserver({
    threshold: 0.6,
  });

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  // Filter videos based on category selection
  const filteredVideos = videos.filter((video) => {
    if (activeCategory === "All") return true;
    return video.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Re-run observer registration when video list or categories update
  useEffect(() => {
    updateObservedElements();
  }, [filteredVideos.length, activeCategory]);

  // Handle scroll navigation from bookmarks/saved page
  useEffect(() => {
    if (state?.scrollToId && !loading && filteredVideos.length > 0) {
      const targetId = state.scrollToId;
      // Small timeout to allow render completion
      const timer = setTimeout(() => {
        const el = document.querySelector(`[data-id="${targetId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [state, loading, filteredVideos]);

  return (
    <div className="flex flex-column align-center w-full h-full" style={{ position: "relative" }}>
      {/* Category Selection Filter Pills */}
      <CategoryChips />

      {/* Loading indicator */}
      {loading && videos.length === 0 ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading shorts feed...</p>
        </div>
      ) : error ? (
        <div className="empty-container">
          <div className="alert-error">Failed to load videos: {error}</div>
          <button className="btn-primary" onClick={() => dispatch(fetchVideos())}>
            Retry Fetch
          </button>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="empty-container">
          <Play size={48} />
          <h3 style={{ color: "white" }}>No Shorts Available</h3>
          <p>Be the first to upload a short learning video for this category!</p>
        </div>
      ) : (
        /* The main scroll snapping feed container */
        <div className="shorts-feed-container">
          {filteredVideos.map((video) => (
            <ShortsCard
              key={video.id}
              video={video}
              isActive={activeId === video.id.toString()}
              registerRef={registerElement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
