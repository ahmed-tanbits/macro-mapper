import React from "react";
import WelcomeToPremium from "./WelcomeToPremium";
import Navbar from "@/app/components/Navbar";

const signup = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <main>
        <WelcomeToPremium />
      </main>
    </>
  );
};

export default signup;
