"use client";

import { DoorOpen, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Filters from "./filters/Filters";
import { useFilterContext } from "../context/FilterContext";
import SearchBar from "./SearchBar";
import usericon from "./usericon.png";
import { Crown } from "lucide-react";

type Props = {};

export default function Navbar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSidebarLinks = [
    { label: "Home", link: "/" },
    {
      label: "List your menu",
      link: "/",
    },
    {
      label: "Help",
      link: "https://get.macromapper.co/contact",
      borderb: "1px solid #EDEDED",
      p: "0 0 1.3rem",
    },

    { label: "Profile", link: "/", p: ".4rem 0 0" },
    { label: "Subscription", link: "/" },
    {
      label: "Log out",
      link: "/",
      borderb: "1px solid #EDEDED",
      p: "0 0 1.3rem",
    },
    {
      label: "Disclaimers",
      link: "/",
      fs: "12px",
      underline: "underline",
    },
    {
      label: "Policies",
      link: "/",
      fs: "12px",
      underline: "underline",
      p: "0 0 2rem",
      borderb: "1px solid #EDEDED",
    },
  ];

  const cardContent = [
    "Unlock Macronutrient Results",
    "Unlock Advanced Search",
    "Unlock Allergy Results",
  ];

  return (
    <>
      {/* <nav className="flex w-full justify-between items-center h-16 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="md:hidden p-1">
            <Menu size={24} />
          </button>
          <Link href={"/"}>
            <Image
              src={"/logo.png"}
              width={350}
              height={200}
              alt="macromapper logo"
              className="w-40 md:w-[250px]"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 text-neutral-600 font-normal">
          <div className="hidden md:flex items-center justify-center  gap-6">
            <Link
              href={"https://get.macromapper.co/get-started"}
              target="_blank"
              className="py-2 px-4 cursor-pointer select-none hover:bg-neutral-100 rounded-xl"
            >
              Get Listed
            </Link>
            <Link
              href={"https://get.macromapper.co/platform"}
              target="_blank"
              className="py-2 px-4 cursor-pointer select-none hover:bg-neutral-100 rounded-xl"
            >
              Platform
            </Link>
          </div>
        </div>
      </nav> */}

      <nav className="flex flex-col 1200:flex-row w-full justify-between items-center sm:items-start px-4 md:px-8 border-b pt-4 pb-3">
        <div className="flex justify-between items-start w-full">
          <div className="flex gap-12 items-start">
            {/* logo */}
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-14 md:hidden p-1"
              >
                <Menu size={24} />
              </button>
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={240}
                  height={100}
                  alt="macromapper logo"
                  className="w-[200px] md:w-[240px]"
                />
              </Link>
            </div>

            {/* search-bar and filters */}
            <div className="hidden 1200:flex flex-col items-center gap-2 w-full max-w-[600px]">
              <SearchBar />
              <FiltersSection />
            </div>
          </div>

          {/* authentication menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4 text-neutral-600 font-normal">
              <Link href="#" className="text-sm font-medium text-black">
                List Your Menu
              </Link>
              <Link href="#" className="text-sm font-medium text-black ">
                Help
              </Link>
            </div>
            <div className="gap-2 items-center flex">
              {isAuthenticated ? (
                <div className="border-0 md:border-l  pl-4 flex items-center gap-2">
                  <span className="hidden md:block">
                    <Menu size={24} />
                  </span>
                  <button
                    onClick={() => setIsAuthenticated(!isAuthenticated)}
                    className="rounded-full"
                  >
                    <span>
                      <Image
                        src="/usericon.png"
                        width={32}
                        height={32}
                        alt="macromapper logo"
                      />
                    </span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => setIsAuthenticated(!isAuthenticated)}
                    className="text-sm font-medium text-black bg-white-600 py-2 px-3 border border-[#CBCBCB] rounded-md"
                  >
                    Log In
                  </button>
                  <Link href="/auth/signup">
                    <button className="text-sm font-medium text-white bg-primary-600 py-2 px-3 border border-primary-600 rounded-md">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex 1200:hidden flex-col justify-between gap-2 w-full mx-auto">
          <SearchBar />
          <FiltersSection />
        </div>
      </nav>

      {/* mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-neutral-900 bg-opacity-30 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 select-none flex flex-col justify-between left-0 z-50 w-80 h-full overflow-y-auto transform bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="">
          <div className="flex items-center gap-1 border-b p-2">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-neutral-500 hover:text-neutral-600"
            >
              <X size={24} />
            </button>
            <h2>
              <Image
                src={"/logo.png"}
                width={250}
                height={100}
                alt="macromapper logo"
                className="w-48 md:w-[250px]"
              />
            </h2>
          </div>
          <div className="mt-4 text-lg flex flex-col mx-4 gap-3">
            {toggleSidebarLinks
              .filter((value) =>
                isAuthenticated
                  ? true
                  : !["Profile", "Subscription", "Log out"].includes(
                      value.label
                    )
              )
              .map((value, index) => (
                <Link
                  key={index}
                  href={value.link}
                  className="text-[#595959] text-[15px]"
                  style={{
                    borderBottom: value.borderb,
                    padding: value.p,
                    fontSize: value.fs,
                    textDecoration: value.underline,
                  }}
                  onClick={() =>
                    value.label === "Log out" && setIsAuthenticated(false)
                  }
                >
                  {value.label}
                </Link>
              ))}
          </div>
        </div>

        <div className="px-4">
          <ul className="flex flex-col gap-3">
            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    href=""
                    onClick={() => setIsAuthenticated(true)}
                    className="block w-full text-black border border-[#CBCBCB] bg-[#f8f8f8] font-medium rounded-lg py-3 text-center"
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href=""
                    className="block w-full text-white border border-[#0AC600] bg-[#0AC600] font-medium rounded-lg py-3 text-center"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                href="/auth/upgrade-to-premium"
                className="flex items-center justify-center gap-1 w-full text-black border border-[#FFD200] bg-[#FFD200] font-medium rounded-lg py-3 text-center"
              >
                <span>Unlock More With Premium</span>
                <span>
                  <Crown size={20} fill="#000" />
                </span>
              </Link>
            </li>
          </ul>
          <ul className="w-full max-w-[350px] bg-white py-5 mb-2 rounded-xl">
            {cardContent.map((value, index) => (
              <li
                key={index}
                className="flex items-center gap-2 pb-2 last:pb-0"
              >
                <span>
                  <Image
                    src="/check-mark.png"
                    alt="check-icon"
                    layout="intrinsic"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="text-sm text-[#272727]">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

const FiltersSection = () => {
  const { filters, syncFilters } = useFilterContext();

  const handleSelectionChange = (type: string, selectedOptions: any) => {
    const newFilters = { ...filters, [type]: selectedOptions };
    syncFilters(newFilters);
  };

  const handleRangeChange = (type: string, range: [number, number]) => {
    const newFilters = { ...filters, [type]: range };
    syncFilters(newFilters);
  };

  return (
    <div className="mt-1 mx-auto w-full">
      <Filters
        filters={filters}
        onSelectionChange={handleSelectionChange}
        onRangeChange={handleRangeChange}
      />
    </div>
  );
};
