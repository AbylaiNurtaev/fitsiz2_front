import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { type MasksType } from "../api/api";

const CatalogPage: React.FC = () => {
  const [popularProducts, setPopularProducts] = useState<MasksType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getMasks()
      .then((data: MasksType[]) => {
        // Split masks into popular (first 4) and recommended (rest)
        setPopularProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки каталога:", error);
        setLoading(false);
      });
  }, []);

  const handleProductClick = (id: number) => {
    navigate(`/details/${id}`);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );  }

  return (
    <div className="min-w-full mx-auto bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="!text-[24px] font-bold text-white">Каталог</h1>
        {/* <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#42BA1A] rounded-2xl flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div className="w-9 h-9 bg-[#42BA1A] rounded-2xl flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
        </div> */}
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-6">
        {/* Popular Section */}
        <div className="grid grid-cols-2 gap-4">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="cursor-pointer"
            >
              <div className="relative mb-3">
                {/* <Heart
                  className={`w-6 h-6 text-red-500 absolute top-2 right-2 ${
                    likedItems.has(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(product.id);
                  }}
                /> */}
             <img
  src={product.imageUrl || "https://via.placeholder.com/150"}
  alt={product.name}
  className="w-full aspect-[3/4] object-cover rounded-2xl bg-gray-100"
/>
              </div>
              {/* <div className="mb-1">
                <span className="text-lg font-bold text-white">
                  {product.price || "Цена не указана"}
                </span>
              </div> */}
              {product.installment && (
                <div className="mb-2">
                  <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                    {product.installment} в сплит
                  </span>
                </div>
              )}
              <h3 className="text-sm font-medium text-white mb-2 leading-tight">
                {product.name}
              </h3>
              {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                <Heart className="w-3 h-3 text-red-400" />
                {product.size && <span>{product.size}</span>}
                {product.size && product.days && <span>•</span>}
                {product.days && <span>{product.days}</span>}
              </div> */}
            </div>
          ))}
        </div>

        {/* Recommended Section */}
       
      </div>

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

export default CatalogPage;