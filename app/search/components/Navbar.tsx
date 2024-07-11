"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

export default function Navbar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 left-4 p-2 rounded-full bg-black text-white z-40 lg:hidden"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-neutral-900 bg-opacity-30 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 select-none flex flex-col justify-between left-0 z-50 w-72 transform bg-white p-3 transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-neutral-500 hover:text-neutral-600"
            >
              <X size={24} />
            </button>
            <Image
              src={"/logo.png"}
              width={250}
              height={100}
              alt="macromapper logo"
              className="w-48 lg:w-[250px]"
            />
          </div>
          <div className="mt-8 text-lg">
            <Link
              href={"/"}
              className="block py-2 px-3 hover:bg-neutral-100 rounded-xl"
              onClick={toggleSidebar}
            >
              Home
            </Link>
            {/* <Link
              href={"/search/map"}
              className="block py-2 px-3 hover:bg-neutral-100 rounded-xl"
              onClick={toggleSidebar}
            >
              Start using
            </Link> */}
            <Link
              href={"https://get.macromapper.co/about-us"}
              target="_blank"
              className="block py-2 px-3 hover:bg-neutral-100 rounded-xl"
            >
              About Us
            </Link>
          </div>
          <hr className="my-8" />
          <div className="text-sm underline">
            <span className="block py-2 px-3">Disclaimers</span>
            <span className="block py-2 px-3">Help</span>
          </div>
        </div>
      </div>
    </>
  );
}
