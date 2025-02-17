"use client";
import React from "react";
import Profile from "./Profile";
import Navbar from "@/app/components/Navbar";
import withAuth from "@/app/hoc/withAuth";

const page = () => {
  return (
    <>
    <Navbar showFilters={false} />
 <main>
      <Profile />
    </main>
    </>
   
  );
};

export default withAuth(page);
