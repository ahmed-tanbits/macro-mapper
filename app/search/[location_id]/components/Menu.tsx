"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import FoodItem from "../FoodItem";

type Props = {
  products: MenuItem[];
};

const Menu: React.FC<Props> = ({ products }) => {
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  ) as string[];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isSticky, setIsSticky] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [isManualScroll, setIsManualScroll] = useState(false);

  const topBarRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    if (topBarRef.current && placeholderRef.current) {
      const sticky = window.scrollY > placeholderRef.current.offsetTop;
      setIsSticky(sticky);
    }

    if (isManualScroll) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (const ref of sectionRefs.current) {
        if (ref) {
          const top = ref.offsetTop;
          const bottom = top + ref.clientHeight;
          if (scrollPosition >= top && scrollPosition <= bottom) {
            const currentCategory = ref.dataset.category!;
            if (currentCategory !== activeCategory) {
              setActiveCategory(currentCategory);
              scrollCategoryIntoView(currentCategory);
            }
            break;
          }
        }
      }
    }, 25); // Delay for automatic scroll
  }, [activeCategory, isManualScroll]);

  const checkOverflow = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
      setIsScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1);
      setIsScrolledToStart(scrollLeft <= 0);
    }
  }, []);

  useEffect(() => {
    if (topBarRef.current) {
      setTopBarHeight(topBarRef.current.offsetHeight);
    }

    checkOverflow();

    const debouncedScrollHandler = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedScrollHandler);
    window.addEventListener("resize", checkOverflow);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkOverflow);
    }

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
      window.removeEventListener("resize", checkOverflow);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", checkOverflow);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, checkOverflow]);

  const handleCategoryClick = (category: string) => {
    setIsManualScroll(true);
    const section = document.getElementById(category);
    if (section) {
      const yOffset = -topBarHeight;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      setTimeout(() => {
        setActiveCategory(category);
        scrollCategoryIntoView(category);
        setIsManualScroll(false);
      }, 700); // Delay for manual scroll
    }
  };

  const scrollCategoryIntoView = (category: string) => {
    const categoryIndex = categories.indexOf(category);
    if (scrollContainerRef.current && categoryIndex !== -1) {
      const categoryButton = scrollContainerRef.current.children[categoryIndex] as HTMLLIElement;
      const containerLeft = scrollContainerRef.current.getBoundingClientRect().left;
      const buttonLeft = categoryButton.getBoundingClientRect().left;
      const offset = buttonLeft - containerLeft - scrollContainerRef.current.clientWidth / 2 + categoryButton.clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + offset,
        behavior: "smooth",
      });
    }
  };

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
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
        <div className="relative">
          <ul
            ref={scrollContainerRef}
            className="flex justify-start space-x-4 overflow-x-auto hide-scrollbar"
          >
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 whitespace-nowrap transition-all rounded-xl ${
                    activeCategory === category
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
          {isOverflowing && !isScrolledToEnd && (
            <div
              onClick={scrollToEnd}
              className="absolute h-full z-10 w-14 right-0 pr-2 bg-gradient-to-l from-white via-white to-transparent text-neutral-400 hover:text-neutral-500 transition-all top-0 flex items-center justify-end cursor-pointer"
            >
              <ChevronsRight />
            </div>
          )}
          {isOverflowing && !isScrolledToStart && (
            <div
              onClick={scrollToStart}
              className="absolute h-full z-10 w-14 left-0 pl-2 bg-gradient-to-r from-white via-white to-transparent text-neutral-400 hover:text-neutral-500 transition-all top-0 flex items-center justify-start cursor-pointer"
            >
              <ChevronsLeft />
            </div>
          )}
        </div>
      </div>
      <div className="px-4 md:px-8">
        {categories.map((category, index) => (
          <div
            key={category}
            id={category}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            data-category={category}
            className="mb-8 pt-8"
          >
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((item) => item.category === category)
                .map((item) => (
                  <FoodItem key={item.prod_id} item={item} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Menu;
