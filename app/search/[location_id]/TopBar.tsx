"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

// const TopBar: React.FC<Props> = ({ categories, activeCategory, setActiveCategory }) => {
  export default function TopBar () {
  const categories = ["Burgers", "Wrappers", "Happy Meal®", "Desserts", "Drinks"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const items = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    category: categories[i % categories.length],
    name: `Item ${i + 1}`,
  }));


  const [isSticky, setIsSticky] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const topBarRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (topBarRef.current && placeholderRef.current) {
        const sticky = window.scrollY > placeholderRef.current.offsetTop;
        setIsSticky(sticky);
      }
    };

    if (topBarRef.current) {
      setTopBarHeight(topBarRef.current.offsetHeight);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const section = document.getElementById(category);
    if (section) {
      const yOffset = -topBarHeight;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <div ref={placeholderRef} style={{ height: isSticky ? `${topBarHeight}px` : "0px" }} />
      <div
        ref={topBarRef}
        className={`w-full bg-white bg-opacity-90 backdrop-blur-lg p-4 px-4 md:px-8 border-b border-transparent transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 z-20 shadow-md border-neutral-200" : ""
        }`}
      >
        <ul className="flex justify-start space-x-4 overflow-x-scroll hide-scrollbar">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 whitespace-nowrap  transition-all rounded-xl ${
                  activeCategory === category ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

