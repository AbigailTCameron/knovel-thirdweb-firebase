import React from "react";

type Props = {
  className?: string;
};

function ArrowRight({ className }: Props) {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      strokeWidth="1.4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export default ArrowRight;
