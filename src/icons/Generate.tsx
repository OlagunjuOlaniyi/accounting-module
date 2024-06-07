import React from "react";

const Generate = ({ color }: { color?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_2972_18329)">
        <path
          d="M12.6667 3.33333V12.6667H3.33333V3.33333H12.6667ZM12.6667 2H3.33333C2.6 2 2 2.6 2 3.33333V12.6667C2 13.4 2.6 14 3.33333 14H12.6667C13.4 14 14 13.4 14 12.6667V3.33333C14 2.6 13.4 2 12.6667 2Z"
          fill="#010C15"
          fill-opacity="0.7"
        />
        <path
          d="M9.33268 11.3337H4.66602V10.0003H9.33268V11.3337ZM11.3327 8.66699H4.66602V7.33366H11.3327V8.66699ZM11.3327 6.00033H4.66602V4.66699H11.3327V6.00033Z"
          fill="#010C15"
          fill-opacity="0.7"
        />
      </g>
      <defs>
        <clipPath id="clip0_2972_18329">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Generate;
