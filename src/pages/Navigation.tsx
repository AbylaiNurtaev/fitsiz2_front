import React from 'react';

const Navigation: React.FC = () => {


  return (
    <div className="mt-6 space-y-2 flex flex-col items-center">
      <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
        Моя маска
      </button>
      <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
        Каталог
      </button>
      <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
        Видео
      </button>
      <button
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
      >
        Профиль
      </button>
    </div>
  );
};

export default Navigation;