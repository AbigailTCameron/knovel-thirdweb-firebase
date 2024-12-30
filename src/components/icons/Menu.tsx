import React from "react";

type Props = {
  className ?: string;
  onClick ?: () => void;
};

function Menu({className, onClick}: Props) {
  return (
    <svg
      width="40px"
      height="40px"
      strokeWidth="2"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      className={className}
      onClick={onClick}
    >
      <path
        d="M3 5H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 12H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 19H21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export default Menu;
