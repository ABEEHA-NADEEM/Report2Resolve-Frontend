import React from "react";

const Button = ({ text, onClick, type = "primary" }) => {
  const baseStyle =
    "px-6 py-3 rounded-lg text-white font-semibold text-lg shadow-md w-full max-w-xs";
  const primaryStyle = "bg-blue-600 hover:bg-blue-700";
  const secondaryStyle = "bg-gray-500 hover:bg-gray-600";

  const style = type === "primary" ? primaryStyle : secondaryStyle;

  return (
    <button className={`${baseStyle} ${style}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
