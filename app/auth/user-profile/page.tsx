import React from "react";
import Profile from "./Profile";
import Navbar from "@/app/components/Navbar";

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

export default page;
