import React from "react";

type Props = {
  className?: string;
};

function BookIcon({className}: Props) {
  return (
    <svg
      width="24px"
      strokeWidth="1.5"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M6 17L20 17"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M6 21L20 21"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M6 21C4.89543 21 4 20.1046 4 19C4 17.8954 4.89543 17 6 17"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9 7L15 7"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

export default BookIcon;
