import React from "react";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineLockClosed } from "react-icons/hi2";

const defaultInputClass =
  "input w-full py-3 px-3 rounded border outline-none";

const PasswordInput = ({
  field,
  placeholder = "Password",
  inputClassName = defaultInputClass
}) => {
  const [show, setShow] = React.useState(false);
  const withLeftIcon = inputClassName !== defaultInputClass;

  return (
    <div className="relative">
      {withLeftIcon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <HiOutlineLockClosed className="w-5 h-5" />
        </span>
      )}
      <input
        {...field}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={inputClassName}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <HiOutlineEyeSlash className="w-5 h-5" />
        ) : (
          <HiOutlineEye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
