import { Link } from "react-router-dom";

function Button({ children, to = "/", variant = "primary", className = "" }) {
  const baseStyle = "inline-flex items-center justify-center rounded-xl px-7 py-4 text-sm font-semibold transition-all duration-300";

  const variants = {
    primary: "bg-[#235f46] text-white shadow-lg shadow-green-900/20 hover:bg-[#1b4d39] hover:-translate-y-0.5",
    secondary: "bg-white text-[#1f3f31] border border-[#e4e9e6] hover:bg-[#f4f7f5] hover:-translate-y-0.5",
  };

  return (
    <Link to={to} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export default Button;
