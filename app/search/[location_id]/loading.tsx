import React from "react";
import LoadingRestaurant from "./components/loading/LoadingRestaurant";
import LoadingInfo from "./components/loading/LoadingInfo";
import LoadingMenu from "./components/loading/LoadingMenu";
import LoadingInformation from "./components/loading/LoadingInformation";


type Props = {};

export default function Loading({}: Props) {
  return (
    <div className="pb-20">
      <LoadingRestaurant />
      <LoadingInfo />
      <LoadingMenu />
      <LoadingInformation />
    </div>
  );
}
