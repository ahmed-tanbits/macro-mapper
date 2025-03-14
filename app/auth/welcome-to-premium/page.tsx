"use client";
import React from "react";
import Navbar from "@/app/components/Navbar";
import withAuth from "@/app/hoc/withAuth";
import WelcomeToPremium from "./WelcomeToPremium";

const page = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <main>
        <WelcomeToPremium />
      </main>
    </>
  );
};

export default withAuth(page);
