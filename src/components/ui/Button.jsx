import { Link } from "react-router-dom";

export default function Button({
  children,
  to, // Link
  type = "button", // button
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
  loading = false,
}) {
  const baseClass = `Button w-full font-extrabold rounded-lg text-lg transition-all duration-300 text-center`;

  const stateClass = loading ? "cursor-wait animate-pulse" : "";

  //Link
  if (to) {
    return (
      <Link
        to={to}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`${baseClass} ${className} block`}
      >
        {children}
      </Link>
    );
  }

  //button
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={loading}
      className={`max-w-md py-3 2xl:py-3.5 px-2 ${baseClass} ${stateClass} ${className}`}
    >
      {children}
    </button>
  );
}
