import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Глобальная обработка необработанных Promise ошибок в production
if (!import.meta.env.DEV) {
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault(); // Предотвращаем вывод ошибки в консоль
  });

  // Подавление ошибок в консоли в production
  window.addEventListener('error', (event) => {
    event.preventDefault(); // Предотвращаем вывод ошибки в консоль
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
