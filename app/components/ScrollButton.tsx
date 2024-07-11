"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const prevScrollY = useRef(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > prevScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      prevScrollY.current = currentScrollY;

      // Toggle visibility based on scroll position
      if (currentScrollY > 300) {
        setVisible(true);
        setIsBottom(window.innerHeight + currentScrollY >= document.body.offsetHeight - 300);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight - 1500, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        onClick={isBottom || scrollDirection === 'up' ? scrollToTop : scrollToBottom}
        className="p-3 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-700 focus:outline-none transition-transform duration-300"
        style={{ transform: `rotate(${isBottom || scrollDirection === 'up' ? '180deg' : '0deg'})` }}
      >
        <ChevronsDown size={24} />
      </button>
    </div>
  );
};

export default ScrollButton;
