import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import Button from "../ui/Button";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[#1f3f31]">
          Mood Sense
        </Link>

        {isAuthenticated ? (
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm font-medium text-[#60766b]">{user?.name || "Pengguna"}</span>
            <Button to="/dashboard" className="px-6 py-3">
              Ke Dashboard
            </Button>
            <button type="button" onClick={handleLogout} className="rounded-xl border border-[#e4e9e6] bg-white px-5 py-3 text-sm font-semibold text-[#1f3f31] transition hover:bg-[#f4f7f5]">
              Keluar
            </button>
          </div>
        ) : (
          <Button to="/register" className="hidden px-6 py-3 md:inline-flex">
            Mulai Gratis
          </Button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
