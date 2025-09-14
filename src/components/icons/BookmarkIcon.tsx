import React from "react";

type Props = {
  className?: string;
};

function BookmarkIcon({className}: Props) {
  return (
    <svg
      width="40px"
      strokeWidth="1.4"
      height="40px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      className={className}
    >
      <path
        d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143"
        strokeWidth="1.4"
        strokeLinecap="round"
      ></path>
      <path
        d="M8 3V11L10.5 9.4L13 11V3"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#de0202"
      ></path>
      <path
        d="M6 17L20 17"
        strokeWidth="1.4"
        strokeLinecap="round"
      ></path>
      <path
        d="M6 21L20 21"
        strokeWidth="1.4"
        strokeLinecap="round"
      ></path>
      <path
        d="M6 21C4.89543 21 4 20.1046 4 19C4 17.8954 4.89543 17 6 17"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

export default BookmarkIcon;
