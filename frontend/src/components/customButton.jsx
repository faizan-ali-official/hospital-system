import clsx from "clsx";
import React from "react";
import { CgSpinner } from "react-icons/cg";

const CustomAuthButton = ({
  isLoading = false,
  className = "",
  type = "submit",
  text,
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      disabled={isLoading}
      className={clsx(
        className,
        isLoading && "disabled:bg-bg-[#004aa3]",
        "w-full flex items-center justify-center capitalize text-white text-lg gap-x-2 cursor-pointer bg-[#004aa3] py-3 rounded-2xl shadow"
      )}
    >
      <span>{text}</span>
      {isLoading && <CgSpinner className="text-xl animate-spin" />}
    </button>
  );
};

export default CustomAuthButton;
