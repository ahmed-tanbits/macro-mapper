"use client";
import React from "react";
import Navbar from "@/app/components/Navbar";
import withAuth from "@/app/hoc/withAuth";
import Subscription from "./Subscription";

const page = () => {
  return (
    <>
    <Navbar showFilters={false} />
 <main>
      <Subscription />
    </main>
    </>
   
  );
};

export default withAuth(page);
