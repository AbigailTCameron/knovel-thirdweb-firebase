import React from "react";

type Props = {
  className ?: string;
  fill?: string;
  onClick ?: () => void;
};

function BookmarkPage({className, fill, onClick}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="80"
      viewBox="0 0 229 734"
      strokeWidth="10"
      fill={fill}
      className={className}
      onClick={onClick}
    >
      <mask id="path-1-inside-1_1946_16030">
        <path
          strokeWidth="10"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 0C4.47715 0 0 4.47713 0 9.99998V734L115.5 431.5L229 734V10C229 4.47715 224.523 0 219 0H10Z"
        />
      </mask>
      <path
        strokeWidth="10"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.47715 0 0 4.47713 0 9.99998V734L115.5 431.5L229 734V10C229 4.47715 224.523 0 219 0H10Z"
        fill={fill}
      />
      <path
        d="M0 734H-1L0.934218 734.357L0 734ZM115.5 431.5L116.436 431.149L115.508 428.675L114.566 431.143L115.5 431.5ZM229 734L228.064 734.351L230 734H229ZM1 9.99998C1 5.02942 5.02943 1 10 1V-1C3.92487 -1 -1 3.92485 -1 9.99998H1ZM1 734V9.99998H-1V734H1ZM0.934218 734.357L116.434 431.857L114.566 431.143L-0.934218 733.643L0.934218 734.357ZM114.564 431.851L228.064 734.351L229.936 733.649L116.436 431.149L114.564 431.851ZM228 10V734H230V10H228ZM219 1C223.971 1 228 5.02944 228 10H230C230 3.92487 225.075 -1 219 -1V1ZM10 1H219V-1H10V1Z"
        fill={fill}
        strokeWidth="10"
        mask="url(#path-1-inside-1_1946_16030)"
      />
    </svg>
  );
}

export default BookmarkPage;
