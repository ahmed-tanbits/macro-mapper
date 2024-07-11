"use client";
import React, { useRef, useState, useEffect } from "react";
import Filters from "./Filters";
import FiltersResponsive from "@/app/search/components/filters/filters-responsive/FiltersResponsive";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  filters: any;
  onFilterChange: (filters: any) => void;
};

export default function FilterBar({ filters, onFilterChange }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(filters);

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } =
          scrollContainerRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
        setIsScrolledToEnd(scrollLeft + clientWidth >= scrollWidth);
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkOverflow);
    }

    return () => {
      window.removeEventListener("resize", checkOverflow);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", checkOverflow);
      }
    };
  }, []);

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSelectionChange = (type: string, selectedOptions: any) => {
    const newFilters = { ...selectedFilters, [type]: selectedOptions };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRangeChange = (type: string, range: [number, number]) => {
    const newFilters = { ...selectedFilters, [type]: range };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <>
      <div className="hidden lg:flex flex-col lg:flex-row bg-neutral-50 relative overflow-hidden gap-3 w-full justify-start items-center h-28 lg:h-16 px-4 md:px-8 border-t border-neutral-100">
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            width={500}
            height={200}
            className="max-w-60"
            alt="macromapper logo"
          />
        </Link>
        <div className="w-[1px] h-8 bg-neutral-200 mx-5"></div>
        {/* <SearchBar /> */}
        <div className="flex overflow-hidden items-end justify-end w-full relative">
          <div
            ref={scrollContainerRef}
            className="flex hide-scrollbar overflow-x-auto items-start gap-3 w-full"
          >
            <Filters
              filters={selectedFilters}
              onSelectionChange={handleSelectionChange}
              onRangeChange={handleRangeChange}
            />
          </div>

          {isOverflowing && !isScrolledToEnd && (
            <div
              onClick={scrollToEnd}
              className="absolute h-full w-14 right-0 bg-gradient-to-l from-neutral-50 text-neutral-400 to-transparent top-0 flex items-center justify-end cursor-pointer"
            >
              <ChevronsRight />
            </div>
          )}
          {isOverflowing && isScrolledToEnd && (
            <div
              onClick={scrollToStart}
              className="absolute h-full w-14 left-0 bg-gradient-to-r from-neutral-50 text-neutral-400 to-transparent top-0 flex items-center justify-start cursor-pointer"
            >
              <ChevronsLeft />
            </div>
          )}
        </div>
      </div>
      <div className="block lg:hidden px-4 overflow-x-clip">
        <FiltersResponsive
          filters={selectedFilters}
          onSelectionChange={handleSelectionChange}
          onRangeChange={handleRangeChange}
        />
      </div>
    </>
  );
}
