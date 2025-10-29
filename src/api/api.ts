import axios from "axios";
import type { User } from "../../context/AuthContext";

// Типы
export type ExtraFieldType = {
  id: number;
  key: string;
  value: string;
};

export type FeatureType = {
  id: number;
  name: string;
};

export type ReviewType = {
  id: number;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type MasksType = {
  id: number;
  name: string;
  instructions: string | null;
  imageUrl: string | null;
  price: number | null;
  weight: number | null;
  viewArea: string | null;
  sensors: number | null;
  power: string | null;
  shadeRange: string | null;
  material: string | null;
  description: string | null;
  link: string | null;
  installment: string | null;
  size: string | null;
  days: number | null;
  features: FeatureType[];
  reviews: ReviewType[];
  ExtraField: ExtraFieldType[];
};

type VideoType = {
  id: number;
  title: string;
  url?: string;
  description?: string;
  duration?: string;
  thumbnailUrl?: string;
};

// API config
export const API_URL =
  import.meta.env.VITE_API_URL || "https://fitsiz-server.ru/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для возврата response.data напрямую и обработки ошибок
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Логируем ошибки только в dev режиме
    if (import.meta.env.DEV) {
      console.error("API Error:", error.response?.data || error.message);
    }
    
    // Возвращаем обработанную ошибку вместо reject
    // Это позволит обрабатывать ошибки без вывода в консоль
    return Promise.reject({
      message: error.response?.data?.error || "Произошла ошибка сервера",
      status: error.response?.status || 500,
      data: error.response?.data || null
    });
  }
);

// Типизированный API с полной обработкой ошибок
export default {
  getUserMasks: async (telegramId: string): Promise<MasksType[]> => {
    try {
      const response = await api.get(`/user/${telegramId}/masks`);
      
      if (import.meta.env.DEV) {
        console.log("Raw API response:", response);
      }
      
      // Если response.data содержит массив
      if (response && response.data) {
        return response.data;
      }
      
      // Если response сам является массивом
      if (Array.isArray(response)) {
        return response;
      }
      
      // Если ничего не найдено
      return [];
    } catch (error) {
      // Возвращаем пустой массив вместо ошибки
      return [];
    }
  },

  registerUser: async (telegramId: string, firstName: string): Promise<User | null> => {
    try {
      return await api.post("/register", { telegramId, firstName });
    } catch (error) {
      return null;
    }
  },

  getUser: async (telegramId: string): Promise<User | null> => {
    try {
      return await api.get(`/user/${telegramId}`);
    } catch (error) {
      return null;
    }
  },

  getMasks: async (): Promise<MasksType[]> => {
    try {
      return await api.get("/masks");
    } catch (error) {
      return [];
    }
  },

  getMaskDetails: async (id: number): Promise<MasksType | null> => {
    try {
      return await api.get(`/masks/${id}`);
    } catch (error) {
      return null;
    }
  },

  getMaskInstructions: async (id: number): Promise<string> => {
    try {
      return await api.get(`/masks/${id}/instructions`);
    } catch (error) {
      return "";
    }
  },

  getCatalog: async (name: string): Promise<MasksType[]> => {
    try {
      return await api.get("/catalog", { params: { name } });
    } catch (error) {
      return [];
    }
  },

  addUserMask: async (telegramId: string, maskId: number): Promise<boolean> => {
    try {
      await api.post(`/user/${telegramId}/add-mask`, { maskId });
      return true;
    } catch (error) {
      return false;
    }
  },

  getVideos: async (): Promise<VideoType[]> => {
    try {
      return await api.get("/videos");
    } catch (error) {
      return [];
    }
  },

  updateProfile: async (
    telegramId: string,
    phone?: string,
    email?: string,
    quiz?: boolean,
    add?: boolean
  ): Promise<User | null> => {
    try {
      return await api.post("/profile", { telegramId, phone, email, quiz, add });
    } catch (error) {
      return null;
    }
  },
};

// Экспорт типов
export type { VideoType };
