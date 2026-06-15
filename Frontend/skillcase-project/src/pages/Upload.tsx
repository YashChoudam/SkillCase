import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createVideo } from "../redux/videoSlice";
import { PlusSquare, ArrowLeft, Play } from "lucide-react";

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading: authLoading } = useAppSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [filePath, setFilePath] = useState("uploads/video1.mp4");
  const [presetSelected, setPresetSelected] = useState<string>("preset1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Route protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const selectPreset = (presetName: string, path: string) => {
    setPresetSelected(presetName);
    setFilePath(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !description.trim() || !category.trim() || !filePath.trim()) {
      setErrorMsg("All fields are required");
      return;
    }

    setIsSubmitting(true);
    dispatch(createVideo({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      file_path: filePath.trim()
    }))
      .unwrap()
      .then(() => {
        setIsSubmitting(false);
        navigate("/");
      })
      .catch((err) => {
        setIsSubmitting(false);
        setErrorMsg(err || "Failed to upload video");
      });
  };

  return (
    <div className="upload-page-container">
      <div className="flex align-center gap-6" style={{ cursor: "pointer", color: "var(--text-secondary)" }} onClick={() => navigate("/")}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </div>

      <div className="upload-card">
        <h2 style={{ fontSize: "20px", fontWeight: "500", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
          <PlusSquare color="var(--accent-red)" />
          <span>Upload Short Video</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "-12px" }}>
          Fill in details to register and stream your video content.
        </p>

        {errorMsg && (
          <div className="alert-error" style={{ margin: 0 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Preset Selections */}
          <div className="auth-form-group">
            <label>Select Video Resource</label>
            <div className="video-preset-selector">
              <div 
                className={`video-preset-card ${presetSelected === "preset1" ? "active" : ""}`}
                onClick={() => selectPreset("preset1", "uploads/video1.mp4")}
              >
                <Play className="video-preset-icon" size={20} fill="currentColor" />
                <span className="video-preset-title">Video 1</span>
                <span className="video-preset-path">uploads/video1.mp4</span>
              </div>

              <div 
                className={`video-preset-card ${presetSelected === "preset2" ? "active" : ""}`}
                onClick={() => selectPreset("preset2", "uploads/video2.mp4")}
              >
                <Play className="video-preset-icon" size={20} fill="currentColor" />
                <span className="video-preset-title">Video 2</span>
                <span className="video-preset-path">uploads/video2.mp4</span>
              </div>

              <div 
                className={`video-preset-card ${presetSelected === "preset3" ? "active" : ""}`}
                onClick={() => selectPreset("preset3", "uploads/video3.mp4")}
              >
                <Play className="video-preset-icon" size={20} fill="currentColor" />
                <span className="video-preset-title">Video 3</span>
                <span className="video-preset-path">uploads/video3.mp4</span>
              </div>
            </div>

            <div className="flex flex-column" style={{ marginTop: "12px", gap: "4px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Or register a custom path:</span>
              <input 
                type="text" 
                placeholder="Enter custom path (e.g. uploads/custom.mp4)" 
                value={filePath}
                onChange={(e) => {
                  setPresetSelected("custom");
                  setFilePath(e.target.value);
                }}
                style={{ backgroundColor: "#0f0f0f" }}
                required
              />
            </div>
          </div>

          {/* Title */}
          <div className="auth-form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Learn React Hooks in 60s"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              required
            />
          </div>

          {/* Description */}
          <div className="auth-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Write a catchy description about this short lesson..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                backgroundColor: "#121212",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                padding: "10px",
                resize: "none"
              }}
              required
            />
          </div>

          {/* Category */}
          <div className="auth-form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                backgroundColor: "#121212",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                padding: "10px"
              }}
            >
              <option value="Tech">Tech</option>
              <option value="Education">Education</option>
              <option value="Life">Life</option>
              <option value="Music">Music</option>
              <option value="General">General</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: "12px", borderRadius: "4px", fontWeight: "600", fontSize: "14px" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Short"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
