import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/AuthContext";
import api from "../api/api";

const QuizPage: React.FC = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleAnswer = async (hasMask: boolean) => {
    if (!user) return;

    try {
      await api.updateProfile(
        user.telegramId,
        user.phone ?? undefined,
        user.email ?? undefined,
        true,
      );
      setUser({ ...user, quiz: true });

      if (hasMask) {
        navigate("/profile");
      } else {
        const wantsHelp = confirm(
          "Вы переходите на официальный чат-бот FITSIZ, который поможет Вам выбрать нужную маску"
        );
        if (wantsHelp) {
          window.location.href = "https://t.me/fitsiz_support_bot";
        } else {
          navigate("/welcome");
        }
      }
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-xs bg-gray-100 rounded-xl shadow-md p-4 text-center">
        <h1 className="text-base font-medium text-gray-800 mb-3">
          Вы приобрели маску <span className="font-semibold text-blue-600">FITSIZ</span>?
        </h1>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleAnswer(true)}
            className="w-full py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
          >
            Да
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="w-full py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
          >
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
