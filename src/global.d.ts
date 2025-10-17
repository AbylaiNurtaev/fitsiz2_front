/* eslint-disable @typescript-eslint/no-explicit-any */
// global.d.ts
export {};

declare global {
  interface Window {
    Telegram: any; // или точнее, если знаешь тип Telegram API
  }
}
