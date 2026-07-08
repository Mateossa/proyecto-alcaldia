import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="flex justify-between items-center px-6 py-2 shadow-md"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <img src="/images/logo_negro.svg" alt="GOV.CO" className="h-8" />
      <button
        className="px-3 py-1 text-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-[#1a1a1a] cursor-pointer"
        style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            color: "white",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-family-main)",
        }}
        onClick={() => navigate("/")}
        >
        Cerrar Sesión
        </button>
    </nav>
  );
}