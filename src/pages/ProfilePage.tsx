import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { type MasksType } from "../api/api";
import { useUserContext } from "../../context/AuthContext";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useUserContext();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [masks, setMasks] = useState<MasksType[]>([]);
  const [userMasks, setUserMasks] = useState<MasksType[]>([]);
  const [selectedMaskId, setSelectedMaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.telegramId) {
      setLoading(true);
  
      // 1) Загрузка данных пользователя
      api.getUser(user.telegramId.toString())
        .then((fetchedUser) => {
          console.log("Fetched user:", fetchedUser); // ДОБАВИТЬ
          setPhone(fetchedUser.phone || "");
          setEmail(fetchedUser.email || "");
          setSelectedMaskId(fetchedUser.maskId || null);
        })
        .catch((error) => {
          console.error("Ошибка получения пользователя:", error);
        });
  
      // 2) Загрузка всех доступных масок
      api.getMasks()
        .then((allMasks) => {
          console.log("All masks:", allMasks); // ДОБАВИТЬ
          setMasks(Array.isArray(allMasks) ? allMasks : []);
        })
        .catch((error) => {
          console.error("Ошибка загрузки масок:", error);
          setMasks([]);
        });
  
      // 3) Загрузка масок пользователя
      api.getUserMasks(user.telegramId.toString())
        .then((userMaskList) => {
          console.log("User masks from API:", userMaskList); // ДОБАВИТЬ
          console.log("Is array?", Array.isArray(userMaskList)); // ДОБАВИТЬ
          console.log("Length:", userMaskList?.length); // ДОБАВИТЬ
          setUserMasks(Array.isArray(userMaskList) ? userMaskList : []);
        })
        .catch((error) => {
          console.error("Ошибка загрузки пользовательских масок:", error);
          setUserMasks([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.telegramId]);
  
  
  const handleUpdate = () => {
    if (user && user.telegramId) {
      setLoading(true);
      api.updateProfile(user.telegramId, phone, email)
        .then(() => api.getUser(user.telegramId.toString()))
        .then((updatedUser) => {
          setUser(updatedUser);
          navigate("/welcome");
        })
        .catch((error) => console.error("Ошибка обновления профиля:", error))
        .finally(() => setLoading(false));
    }
  };

  // Имя текущей маски для показа
  const currentMaskName = masks.find((m) => m.id === selectedMaskId)?.name;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-full">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-6">
          Личный кабинет сварщика
        </h3>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center mb-4 shadow-lg">
  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden">
    {user?.photoUrl || user?.photo_url ? (
      <img
        src={user.photoUrl || user.photo_url}
        alt={user.first_name || "avatar"}
        className="w-full h-full object-cover"
      />
    ) : (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="text-orange-800"
      >
        <circle cx="24" cy="18" r="8" fill="currentColor" opacity="0.8" />
        <path
          d="M12 36c0-6.627 5.373-12 12-12s12 5.373 12 12"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
    )}
  </div>
</div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {user?.first_name || "User"}
        </h2>
      
      </div>

      {/* Поля формы */}
      <div className="space-y-6 ">
      

        {/* Выбор маски */}
        <div>
          <label className="block text-white font-medium mb-3 text-base">
            Моя маска
          </label>
          <div className="flex gap-1">
            <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
              <select
                value={selectedMaskId ?? ""}
                onChange={(e) =>
                  setSelectedMaskId(e.target.value ? Number(e.target.value) : null)
                }
                disabled={!Array.isArray(masks) || masks.length === 0}
                className="w-full bg-transparent text-green-600 text-base focus:outline-none appearance-none"
              >
                <option value="">Выберите маску</option>
                {Array.isArray(masks) &&
                  masks.map((mask) => (
                    <option key={mask.id} value={mask.id}>
                      {mask.name}
                    </option>
                  ))}
              </select>
            </div>
            {selectedMaskId && (
  <button
    className="ml-4 px-3 py-2 bg-black text-white text-sm rounded-lg"
    onClick={async () => {
      if (!selectedMaskId || !user?.telegramId) {
        alert("Выберите маску");
        return;
      }

      try {
        await api.addUserMask(user.telegramId, selectedMaskId);
        const updatedUserMasks = await api.getUserMasks(user.telegramId);
        setUserMasks(Array.isArray(updatedUserMasks) ? updatedUserMasks : []);
      } catch (error) {
        console.log(error);
      }
    }}
  >
    Добавить маску
  </button>
)}

          </div>
          {selectedMaskId && currentMaskName && (
            <p className="text-center text-green-500 text-sm mt-3 font-medium">
              Вы выбрали маску: {currentMaskName}
            </p>
          )}
        </div>

        {/* Ссылки и кнопки */}
        


        {/* Секция "Мои маски" */}
        <h2 className="text-2xl font-bold text-green-700 mb-6">Мои маски</h2>

        {Array.isArray(userMasks) && userMasks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {userMasks.map((mask) => (
              <div
                key={mask.id}
                className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition text-left cursor-pointer"
                onClick={() => navigate(`/details/${mask.id}`)}
              >
               {mask.imageUrl ? (
  <img
    src={mask.imageUrl}
    alt={mask.name}
    className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
  />
) : (
  <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400">
    Нет изображения
  </div>
)}

                <h4 className="text-sm font-medium text-black">{mask.name}</h4>
                {mask.price && <p className="text-sm text-gray-500">{mask.price}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">Здесь пока нет масок</p>
        )}
      </div>

      {/* Кнопки */}
      <div className="mt-12 space-y-4">
        <button
          onClick={handleUpdate}
          disabled={!user?.telegramId || loading}
          className="w-full !bg-[#42BA1A] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Загрузка..." : "Сохранить"}
        </button>
        <button
          onClick={() => navigate("/welcome")}
          className="w-full  text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors"
        >
          Назад
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
