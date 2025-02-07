import Image from "next/image";
import React from "react";

type BannerProps = {
  label?: string;
  para?: string;
};

const Banner: React.FC<BannerProps> = ({ label, para }) => {
  return (
    <div className="hidden sm:block sm:col-span-6 md:col-span-7 relative">
      <Image
        src="/auth-banner.png"
        alt="auth-banner"
        height={100}
        width={100}
        className="w-full h-screen"
      />
      <div className="absolute top-1/2 -translate-y-[200%] left-1/2 -translate-x-1/2 z-10 text-white text-center w-full max-w-[350px]">
        <h4 className="text-xl">{label}</h4>
        <p className="text-sm font-extralight leading-2">{para}</p>
      </div>
    </div>
  );
};

export default Banner;
