import clsx from "clsx";
import type { ButtonProps } from "../utils/interfaces";

function Button({
  className,
  type = "button",
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "px-4 py-4 rounded-2xl  text-white cursor-pointer",
        {},
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Button;
