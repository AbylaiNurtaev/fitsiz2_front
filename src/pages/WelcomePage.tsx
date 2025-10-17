import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/AuthContext";
import { FaVideo, FaList, FaTelegramPlane } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const WelcomePage: React.FC = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const buttons = [
    {
      label: "Настроить свою маску",
      icon: <FaVideo className="text-2xl text-black" />,
      path: "/video",
      external: false,
    },
    {
      label: "Помощник по сварке",
      icon: <FaTelegramPlane className="text-2xl text-black" />,
      path: "https://t.me/fitsiz_assistant_bot",
      external: true, // 👈 теперь внешняя ссылка
    },
    {
      label: "Чат поддержки",
      icon: <FaMessage className="text-2xl text-black" />,
      path: "https://t.me/fitsiz_support_bot",
      external: true, // 👈 теперь внешняя ссылка
    },
    {
      label: "Каталог",
      icon: <FaList className="text-2xl text-black" />,
      path: "/catalog",
      external: false,
    },
  ];
  const openLink = (path: string, external?: boolean) => {
    if (external) {
      if (window.Telegram?.WebApp) {
        // Миниапп → открываем в Telegram
        window.Telegram.WebApp.openTelegramLink(path);
      } else {
        // Браузер → открываем в новой вкладке
        window.open(path, "_blank");
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className="px-4 py-10 max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-[#42BA1A]">
          Привет, {user?.first_name || "Гость"}!
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          Добро пожаловать в
          <strong className="text-[#42BA1A]"> FITSIZ APP</strong> Официальная
          платформа для владельцев масок FITSIZ
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5">
        {buttons.map(({ label, icon, path, external }) => (
          <div
            key={label}
            onClick={() => openLink(path, external)}
            className="flex items-center gap-4 p-4 rounded-2xl shadow-lg cursor-pointer bg-[#42BA1A] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="bg-white rounded-full p-3 shadow-inner">{icon}</div>
            <div className="text-white font-semibold text-lg">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
