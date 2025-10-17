import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaVideo, FaList } from "react-icons/fa";
import { Home } from "lucide-react";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { path: "/welcome", icon: <Home />, label: "Домашняя" },
    { path: "/catalog", icon: <FaList />, label: "Каталог" },
    { path: "/video", icon: <FaVideo />, label: "Все обзоры" },
    { path: "/profile", icon: <FaUser />, label: "Профиль" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 !bg-black border-t shadow-none flex justify-around py-2 pb-5 z-50">
      {navItems.map(({ path, icon }, i) => {
        const isActive = pathname === path;
        return (
          <div
            key={i}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center py-3 text-xs !bg-black focus:outline-none outline-none ring-0 ${
              isActive ? "text-[#42BA1A]" : "text-white"
            }`}
            
          >
            <div className="text-2xl">{icon}</div>
          </div>
        );
      })}
    </nav>
  );
};

export default BottomNav;
