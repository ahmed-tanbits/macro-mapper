"use client";

import { DoorOpen, Menu, X } from "lucide-react";
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
      <nav className="flex w-full justify-between items-center h-16 px-4 md:px-8">
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
              href={"https://get.macromapper.co/macromapping"}
              target="_blank"
              className="py-2 px-4 cursor-pointer select-none hover:bg-neutral-100 rounded-xl"
            >
              Get Listed
            </Link>
            <Link
              href={"https://get.macromapper.co/about-us"}
              target="_blank"
              className="py-2 px-4 cursor-pointer select-none hover:bg-neutral-100 rounded-xl"
            >
              About Us
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-neutral-900 bg-opacity-30 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 select-none flex flex-col justify-between left-0 z-50 w-72 transform bg-white p-3 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="">
          <div className="flex items-center gap-4">
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
                className="w-48 md:w-[250px] hidden md:block"
              />
            </h2>
          </div>
          <div className="mt-8 text-lg ">
            <Link
              href={"/"}
              className="block py-2 px-3 hover:bg-neutral-100 rounded-xl"
            >
              Home
            </Link>
            <Link
              href={"https://get.macromapper.co/macromapping"}
              className="block py-2 px-3 hover:bg-neutral-100 rounded-xl"
            >
              Get Listed
            </Link>
            <Link
              href={"https://get.macromapper.co/about-us"}
              target="_blank"
              className="block py-2 px-3 hover:bg-neutral-100 rounded-xl"
            >
              About Us
            </Link>
          </div>
          <hr className="my-8" />
          <div className=" text-sm underline">
            <Link
              href={"https://get.macromapper.co/about-us"}
              target="_blank"
              className="block py-2 px-3"
            >
              Disclaimers
            </Link>
            <Link
              href="https://get.macromapper.co/contact"
              target="_blank"
              className="block py-2 px-3"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
