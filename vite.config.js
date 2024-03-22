import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
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
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: ["*.custom.com"],
      /** custom certification directory */
      certDir: "/Users/.../.devServer/cert",
    }),
  ],
});
