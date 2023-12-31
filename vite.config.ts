import { defineConfig } from "vite";
import UnoCSS from 'unocss/vite'
import vue from "@vitejs/plugin-vue";

export default defineConfig(async () => ({
  plugins: [vue(), UnoCSS(),],

  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
}));
