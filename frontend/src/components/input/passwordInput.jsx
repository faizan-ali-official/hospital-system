import React from "react";

const PasswordInput = ({ field, placeholder }) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <input
        {...field}
        type={show ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="input w-full py-3 px-3 rounded border outline-none"
      />

      <span
        className="absolute right-3 top-3 cursor-pointer text-gray-600"
        onClick={() => setShow(!show)}
      >
        {show ? "🙈" : "👁️"}
      </span>
    </div>
  );
};

export default PasswordInput;
