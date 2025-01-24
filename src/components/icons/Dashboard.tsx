import React from "react";

type Props = {
  className?: string;
  onClick ?: () => void;
};

function Dashboard({ className, onClick }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="109"
      height="102"
      viewBox="0 0 109 102"
      fill="none"
      className={className}
      onClick={onClick}
    >
      <rect x="20" width="30" height="60" rx="5" fill="white" />
      <rect x="59" y="42" width="30" height="60" rx="5" fill="white" />
      <rect x="59" y="14" width="50" height="23" rx="5" fill="white" />
      <rect y="65" width="50" height="23" rx="5" fill="white" />
    </svg>
  );
}

export default Dashboard;
