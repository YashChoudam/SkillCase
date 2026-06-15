import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchComments, addComment } from "../redux/videoSlice";
import { Link } from "react-router-dom";

interface CommentSheetProps {
  videoId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({ videoId, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState("");
  const comments = useAppSelector((state) => state.video.comments[videoId] || []);
  const { commentsLoading } = useAppSelector((state) => state.video);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [dispatch, isOpen, videoId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    dispatch(addComment({ videoId, content: newComment.trim() }));
    setNewComment("");
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Backdrop to close when clicking outside */}
          <motion.div
            className="comment-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Comment Sheet Container */}
          <motion.div
            className="comment-sheet-container"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Sheet Header */}
            <div className="comment-sheet-header">
              <h3>Comments ({comments.length})</h3>
              <button onClick={onClose} className="close-sheet-button">
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {commentsLoading && comments.length === 0 ? (
                <div className="loading-container" style={{ padding: "24px" }}>
                  <div className="spinner" style={{ width: "24px", height: "24px" }}></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="empty-container" style={{ padding: "32px 16px" }}>
                  <MessageCircle size={32} />
                  <p style={{ fontSize: "14px", marginTop: "8px" }}>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {comment.name ? comment.name.substring(0, 2).toUpperCase() : "U"}
                    </div>
                    <div className="comment-content-wrapper">
                      <div className="comment-user-meta">
                        <span className="comment-user-name">{comment.name || "Anonymous"}</span>
                        <span className="comment-time">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input Form */}
            <div className="comment-input-area">
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="comment-form">
                  <input
                    type="text"
                    placeholder={`Add a comment as ${user?.name}...`}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength={1000}
                  />
                  <button
                    type="submit"
                    className="comment-submit-button"
                    disabled={!newComment.trim()}
                  >
                    <Send size={16} />
                  </button>
                </form>
              ) : (
                <div style={{ fontSize: "13px", color: "#aaaaaa", width: "100%", textAlign: "center", padding: "4px 0" }}>
                  Please <Link to="/login" style={{ color: "var(--accent-blue)", fontWeight: "500" }}>Sign In</Link> to post comments.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentSheet;
