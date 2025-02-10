import Image from "next/image";
import Link from "next/link";
import React from "react";

function FoodCard() {
  const mainCard = [
    {
      img: "/bottom-section-image1.png",
      label: "MENU CALCULATION",
      para: "Get your menu calculated, mapped and listed on macromapper.",
      btnText: "Get started",
      link: "https://get.macromapper.co/get-started",
      bg: "#C4DBAD",
    },
    {
      img: "/bottom-section-image2.png",
      label: "LEARN MORE",
      para: "Curious how macromapper works?",
      btnText: "Learn more",
      link: "https://get.macromapper.co/get-started",
      bg: "#DFD0AA",
    },
  ];

  return (
    <section className="bg-transparent mt-16 w-full mx-auto max-w-screen-xl px-4 pt-6 lg:px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {mainCard.map((value, index) => (
          <div
            key={index}
            className="card flex flex-col items-center bg-white shadow-lg rounded-2xl overflow-hidden relative"
          >
            <Image
              src={value.img}
              alt={value.label}
              width={300}
              height={200}
              className="rounded-md w-full"
            />
            <div
              className="flex flex-col 425:flex-row items-start 425:items-center gap-3 425:gap-0 justify-between p-3 w-full absolute bottom-0 left-0"
              style={{ backgroundColor: `${value.bg}` }}
            >
              <div className="text-[#2B2B2B] md:h-[70px]">
                <p className="text-sm font-bold pb-1">{value.label}</p>
                <p className="text-md font-semibold w-full max-w-[300px] leading-5">
                  {value.para}
                </p>
              </div>
              <Link
                href={value.link}
                className="inline-block bg-[#2D2B1E] text-white w-full 425:w-[150px] py-2 rounded-full transition text-center"
              >
                {value.btnText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FoodCard;
