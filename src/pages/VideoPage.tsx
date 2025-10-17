import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { type VideoType } from "../api/api";

const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getVideos()
      .then((data: VideoType[]) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки видео:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );  }

  return (
    <div className=" mx-auto !min-w-full py-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Видео уроки</h2>

      {videos.length > 0 ? (
        <div className="">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-start rounded-xl  p-3 hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              <img
                src={video.thumbnailUrl || "https://via.placeholder.com/150"}
                alt={video.title}
                className="w-24 h-14 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                {/* {video.duration && (
                  <p className="text-xs text-gray-400">{video.duration}</p>
                )} */}
                <h3 className="text-sm font-semibold text-white leading-tight">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-xs text-white mt-1">{video.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">Видео пока недоступны</p>
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

export default VideoPage;