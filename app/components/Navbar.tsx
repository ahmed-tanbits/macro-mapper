"use client";

import { DoorOpen, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Filters from "./filters/Filters";
import { useFilterContext } from "../context/FilterContext";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import usericon from "./usericon.png";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

type Props = { showFilters?: boolean };

export default function Navbar({ showFilters }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter(); // ✅ Use Next.js router for navigation
  const { session, logout, user } = useAuth(); // ✅ Get token from context
  const isAuthenticated = !!session?.access_token; // ✅ User is authenticated if token exists

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

  const handleLogOut = () => {
    logout();
    router.push("/auth/login"); // Redirect to login page
  }

  return (
    <>
      <nav className="relative z-50 bg-white flex flex-col 1200:flex-row w-full justify-between items-center sm:items-start px-4 md:px-8 border-b pt-4 pb-3">
        <div className="grid items-center 1200:items-start grid-cols-12 gap-0 1200:gap-10 w-full">
          <div
            className={`${
              showFilters
                ? "col-span-9 md:col-span-4 1200:col-span-2 mb-2 1200:mb-0"
                : "col-span-4"
            } `}
          >
            {/* logo */}
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

          {/* search-bar and filters desktop screen */}
          {showFilters && (
            <div className="hidden 1200:block 1200:col-span-6">
              <div className="hidden 1200:flex flex-col items-center gap-2 w-full max-w-[600px]">
                <SearchBar />
                <FiltersSection isAuthenticated={isAuthenticated} />
              </div>
            </div>
          )}

          {/* authentication menu */}
          <div
            className={`${
              showFilters
                ? "col-span-3 md:col-span-8 1200:col-span-4 ms-auto mb-2 1200:mb-0"
                : "col-span-8 ms-auto"
            } `}
          >
            <div className="flex items-center gap-4">
              <div className="hidden md:flex gap-3 text-neutral-600 font-normal border-0 md:border-r pe-4">
                <Link href="#" className="text-sm font-medium text-black">
                  List Your Menu
                </Link>
                <Link href="#" className="text-sm font-medium text-black ">
                  Help
                </Link>
              </div>
              <div className="gap-2 items-center flex">
                <button
                  onClick={toggleSidebar}
                  className="block md:hidden mt-1 425:mt-0"
                >
                  <Menu size={24} />
                </button>

                {isAuthenticated ? (
                  // <div className="flex items-center gap-2">
                  //   <button

                  //     onClick={() => router.push("/auth/user-profile")}
                  //     className="rounded-full"
                  //   >
                  //     <span>
                  //       <Image
                  //         src="/usericon.png"
                  //         width={32}
                  //         height={32}
                  //         alt="macromapper logo"
                  //       />
                  //     </span>
                  //   </button>
                  // </div>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-full focus:outline-none">
                          <Image
                            src="/usericon.png"
                            width={32}
                            height={32}
                            alt="User Profile"
                          />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push("/auth/user-profile")}
                        >
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/subscription")}
                          className="cursor-pointer"
                        >
                          Subscription
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleLogOut}
                          className="text-red-500 cursor-pointer"
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="hidden md:flex gap-2">
                    <button
                      onClick={() => router.push("/auth/login")}
                      className="text-sm font-medium text-black bg-white-600 py-2 px-3 border border-[#CBCBCB] rounded-md"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => router.push("/auth/signup")}
                      className="text-sm font-medium text-white bg-primary-600 py-2 px-3 border border-primary-600 rounded-md"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* search-bar and filters for mobile screen */}
        {showFilters && (
          <div className="flex 1200:hidden flex-col justify-between gap-2 w-full mx-auto">
            <SearchBar />
            <FiltersSection isAuthenticated={isAuthenticated} />
          </div>
        )}
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
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={240}
                  height={100}
                  alt="macromapper logo"
                  className="w-[160px] md:w-[180px]"
                />
              </Link>
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
                  onClick={() => value.label === "Log out" && handleLogOut()}
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
                  <button
                    onClick={() => router.push("auth/login")}
                    className="block w-full text-black border border-[#CBCBCB] bg-[#f8f8f8] font-medium rounded-lg py-3 text-center"
                  >
                    Log In
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("auth/signup")}
                    className="block w-full text-white border border-[#0AC600] bg-[#0AC600] font-medium rounded-lg py-3 text-center"
                  >
                    Sign Up
                  </button>
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

const FiltersSection = ({ isAuthenticated }: { isAuthenticated?: boolean }) => {
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
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};
