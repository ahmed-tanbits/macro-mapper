import React from "react";
import DisclaimerPopup from "./DisclaimerPopup";

type Props = { children: any };

export default function layout({ children }: Props) {
  return (
    <>
      {children}
      <DisclaimerPopup />
    </>
  );
}
