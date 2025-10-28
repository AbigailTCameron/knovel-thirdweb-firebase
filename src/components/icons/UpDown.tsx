import React from "react";

type Props = {
  className?: string;
};

function UpDown({className}: Props) {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      strokeWidth="1.4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      className={className}
    >
      <path
        d="M17 8L12 3L7 8"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M17 16L12 21L7 16"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export default UpDown;
