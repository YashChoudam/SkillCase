import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setActiveCategory } from "../redux/videoSlice";

const PRESET_CATEGORIES = ["All", "Learning", "Tech", "Education", "Life", "Music", "General"];

export const CategoryChips: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector((state) => state.video.activeCategory);

  return (
    <div className="category-chips-wrapper">
      {PRESET_CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`category-chip ${activeCategory === cat ? "active" : ""}`}
          onClick={() => dispatch(setActiveCategory(cat))}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
