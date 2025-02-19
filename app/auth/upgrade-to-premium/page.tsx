import React from "react";
import Navbar from "@/app/components/Navbar";
import UpgradeToPremium from "./UpgradeToPremium";

const signup = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <main>
        <UpgradeToPremium />
      </main>
    </>
  );
};

export default signup;
