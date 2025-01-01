import React from "react";

type Props = {
  className?: string;
  onClick ?: () => void;
};

function ItalicsButton({className, onClick}: Props) {
  return (
      <svg
      width="24px"
      height="24px"
      strokeWidth="2"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        d="M11 5L14 5M17 5L14 5M14 5L10 19M10 19L7 19M10 19L13 19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>

    
  );
}

export default ItalicsButton;
