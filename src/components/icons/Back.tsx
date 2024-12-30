import React from "react";

type Props = {
  className: string;
};

function Back({className}: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="3"
      fill="currentColor"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}

    >
      <path
        d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export default Back;
