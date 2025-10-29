/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useUserContext } from "../../context/AuthContext";

const AuthPage: React.FC = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
  
    const handleLogin = async (tgUser: any) => {
      try {
        const registeredUser = await api.registerUser(
          tgUser.id.toString(),
          tgUser.first_name || tgUser.username || "User"
        );
        
        // Если регистрация не удалась, попробуем получить существующего пользователя
        if (!registeredUser) {
          const existingUser = await api.getUser(tgUser.id.toString());
          if (existingUser) {
            setUser({ ...tgUser, ...existingUser });
            if (existingUser.quiz) {
              navigate("/welcome");
            } else {
              navigate("/quiz");
            }
          } else {
            // Если ни регистрация, ни получение не удались - используем базовые данные
            setUser(tgUser);
            navigate("/quiz");
          }
          return;
        }
        
        // 👇 объединяем данные, чтобы не потерять имя/username/фото
        setUser({ ...tgUser, ...registeredUser });
        
        if (registeredUser.quiz) {
          navigate("/welcome");
        } else {
          navigate("/quiz");
        }
      } catch (error) {
        // Даже при ошибке продолжаем с базовыми данными пользователя
        setUser(tgUser);
        navigate("/quiz");
      }
    };
    
  
    if (tg) {
      tg.ready();
      if (tg.isVersionAtLeast("8.0")) {
        tg.requestFullscreen();
        tg.setHeaderColor("#000000");
      } else {
        tg.expand();
        if (import.meta.env.DEV) {
          console.log(
            "Bot API ниже 8.0, используется expand(). Текущая версия Telegram:",
            tg.version
          );
        }
      }
  
      const initData = tg.initDataUnsafe;
      if (import.meta.env.DEV) {
        console.log("Telegram initData:", JSON.stringify(initData, null, 2));
      }
  
      if (initData?.user) {
        if (import.meta.env.DEV) {
          console.log("User data extracted:", initData.user);
        }
        handleLogin(initData.user);
      }
    } else {
      if (import.meta.env.DEV) {
        console.warn("Telegram.WebApp is not available. Environment:", {
          windowLocation: window.location.href,
          userAgent: navigator.userAgent,
        });
      }
  
      // Попробуем получить данные из tgWebAppData в URL (например, при открытии в браузере)
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const tgWebAppData = params.get("tgWebAppData");
  
      if (tgWebAppData) {
        const decodedData = decodeURIComponent(tgWebAppData);
        const dataParams = new URLSearchParams(decodedData);
        const userParam = dataParams.get("user");
        const user = userParam
          ? JSON.parse(decodeURIComponent(userParam))
          : null;
  
        if (user) {
          if (import.meta.env.DEV) {
            console.log("Extracted user data from tgWebAppData:", user);
          }
          handleLogin(user);
        }
      } else {
        // Хардкод для тестов в браузере
        if (import.meta.env.DEV) {
          console.log("tgWebAppData not found in URL, using hardcoded data");
        }
        const hardcodedUser = {
          id: "5969166369",
          first_name: "Денис",
          username: "denis_nickname",
          photo_url:
            "https://t.me/i/userpic/320/ArOpXH92rj_EpmqJ6uB_-vEugbCinOd3VU8tLlkf5DSxI8r40DuBCgyZH4VxImpQ.svg",
        };
  
        handleLogin(hardcodedUser);
      }
    }
  }, [setUser, navigate]);
  
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default AuthPage;
