import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/AuthContext";
import api, { type MasksType } from "../api/api";

const MaskPage: React.FC = () => {
  const { user } = useUserContext();
  const [masks, setMasks] = useState<MasksType[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (user?.telegramId) {
      api
        .getMasks()
        .then((data: MasksType[]) => {
          // Filter masks to show only the one associated with the user
          const userMask = data.filter((mask) => mask.id === user.maskId);
          setMasks(userMask);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка загрузки масок:", error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Мои маски</h2>

      {masks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {masks.map((mask) => (
            <div
              key={mask.id}
              className="bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition text-left"
              onClick={() => navigate(`/details/${mask.id}`)}
            >
              {mask.imageUrl ? (
                <img
                  src={mask.imageUrl}
                  alt={mask.name}
                  className="w-full h-28 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-28 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-gray-400">
                  Нет изображения
                </div>
              )}
              <h4 className="text-sm font-medium text-gray-800">{mask.name}</h4>
              {mask.price && (
                <p className="text-sm text-gray-500">{mask.price}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Здесь пока нет масок</p>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/welcome")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Назад
        </button>
      </div>
    </div>
  );
};

export default MaskPage;
