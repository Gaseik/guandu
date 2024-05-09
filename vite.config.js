import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/server.crt')),
    },
    host: '0.0.0.0'
  },
  plugins: [
    react(),
    {
      name: "mindar-three-handler",
      enforce: "pre",
      resolveId(source) {
        if (source === "MINDAR.IMAGE.MindARThree") {
          return source; // 假設是你的非 JavaScript 檔案的路徑
        }
        return null;
      },
      load(id) {
        if (id === "MINDAR.IMAGE.MindARThree") {
          return "export default {}"; // 返回一個空的對象或符合你期望的內容
        }
        return null;
      },
    },
  ],
});
