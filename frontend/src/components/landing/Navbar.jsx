import { Link } from "react-router-dom";
import Button from "../ui/Button";

function Navbar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[#1f3f31]">
          Mood Sense
        </Link>

        <Button to="/register" className="hidden px-6 py-3 md:inline-flex">
          Mulai Gratis
        </Button>
      </nav>
    </header>
  );
}

export default Navbar;
