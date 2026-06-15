import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { 
  optimisticLike, 
  likeVideoAction, 
  optimisticBookmark, 
  bookmarkVideoAction 
} from "../redux/videoSlice";
import { 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommentSheet from "./CommentSheet";
import { API_BASE_URL } from "../api/axiosConfig";
import type { Video } from "../api/videoApi";

interface ShortsCardProps {
  video: Video;
  isActive: boolean;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

// Global mutable muted state to persist volume choice across scrolling
let globalIsMuted = true;

export const ShortsCard: React.FC<ShortsCardProps> = ({ video, isActive, registerRef }) => {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(globalIsMuted);
  const [showPlayIndicator, setShowPlayIndicator] = useState<"play" | "pause" | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const liked = useAppSelector((state) => !!state.video.likedVideoIds[video.id]);
  const bookmarked = useAppSelector((state) => !!state.video.bookmarkedVideoIds[video.id]);

  const cleanPath = video.file_path.startsWith("/") ? video.file_path.slice(1) : video.file_path;
  const fullVideoUrl = video.file_path.startsWith("http") 
    ? video.file_path 
    : `${API_BASE_URL}/${cleanPath}`;

  // Synchronize playback state with active observer
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isActive) {
      setIsPlaying(true);
      videoEl.muted = isMuted;
      videoEl.play().catch((err) => {
        // Autoplay policy blocker
        console.warn("Autoplay block caught: user needs to click or interact.", err);
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(false);
      videoEl.pause();
      videoEl.currentTime = 0; // restart
    }
  }, [isActive, isMuted]);

  // Sync volume state across all cards
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMute = !isMuted;
    setIsMuted(newMute);
    globalIsMuted = newMute;
    if (videoRef.current) {
      videoRef.current.muted = newMute;
    }
  };

  // Play / Pause toggle on click
  const handlePlayPause = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
      setShowPlayIndicator("pause");
    } else {
      videoEl.play().catch(console.error);
      setIsPlaying(true);
      setShowPlayIndicator("play");
    }

    // Fade out play/pause indicator popup
    setTimeout(() => {
      setShowPlayIndicator(null);
    }, 600);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Dispatch optimistic update
    dispatch(optimisticLike(video.id));
    // Hit backend
    dispatch(likeVideoAction(video.id));
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Dispatch optimistic update
    dispatch(optimisticBookmark(video.id));
    // Hit backend
    dispatch(bookmarkVideoAction(video.id));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/videos/${video.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    });
  };

  return (
    <div 
      className="shorts-card" 
      data-id={video.id.toString()}
      ref={(el) => registerRef(video.id.toString(), el)}
    >
      <div className="shorts-player-container">
        {/* The Native HTML Video tag */}
        <video
          ref={videoRef}
          src={fullVideoUrl}
          className="shorts-video"
          loop
          playsInline
          muted={isMuted}
          onClick={handlePlayPause}
        />

        {/* Global Mute/Volume Overlay Indicator */}
        <button className="audio-mute-indicator" onClick={toggleMute}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Play/Pause Large Fade Indicator Popup */}
        <AnimatePresence>
          {showPlayIndicator && (
            <motion.div 
              className="play-pause-indicator"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {showPlayIndicator === "play" ? <Play size={28} fill="white" /> : <Pause size={28} fill="white" />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Details Overlay */}
        <div className="shorts-info-overlay">
          <div className="uploader-info">
            <div className="uploader-avatar">
              {video.category.substring(0, 1).toUpperCase()}
            </div>
            <span className="uploader-name">@{video.category} Instructor</span>
            <span className="category-tag">{video.category}</span>
          </div>

          <h4 className="shorts-title">{video.title}</h4>
          
          <p 
            className={`shorts-description ${isDescExpanded ? "expanded" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsDescExpanded(!isDescExpanded);
            }}
          >
            {video.description}
          </p>
        </div>

        {/* Share Feedback Toast */}
        <AnimatePresence>
          {showShareToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: "absolute",
                top: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0,0,0,0.85)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                zIndex: 10
              }}
            >
              Link copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Controls overlays (Liked, Comment, Bookmark, Share) */}
        <div className="shorts-sidebar-controls">
          {/* Like */}
          <div className="control-item">
            <button 
              className={`control-button ${liked ? "active" : ""}`} 
              onClick={handleLike}
            >
              <ThumbsUp size={20} fill={liked ? "currentColor" : "none"} />
            </button>
            <span className="control-label">{video.like_count}</span>
          </div>

          {/* Comment */}
          <div className="control-item">
            <button 
              className="control-button" 
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentsOpen(true);
              }}
            >
              <MessageSquare size={20} />
            </button>
            <span className="control-label">💬</span>
          </div>

          {/* Bookmark */}
          <div className="control-item">
            <button 
              className={`control-button ${bookmarked ? "active-bookmark" : ""}`} 
              onClick={handleBookmark}
            >
              <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <span className="control-label">Save</span>
          </div>

          {/* Share */}
          <div className="control-item">
            <button className="control-button" onClick={handleShare}>
              <Share2 size={20} />
            </button>
            <span className="control-label">Share</span>
          </div>
        </div>

        {/* Slide-Up Bottom Comments Drawer Sheet */}
        <CommentSheet 
          videoId={video.id} 
          isOpen={isCommentsOpen} 
          onClose={() => setIsCommentsOpen(false)} 
        />
      </div>
    </div>
  );
};

export default ShortsCard;
