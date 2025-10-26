import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
<<<<<<< HEAD
  plugins: [react(), tailwindcss()],
});
=======
  plugins: [react()],
  css: {
    postcss: './postcss.config.js' // Remove this line if it exists
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
>>>>>>> 821e163 (Property listings page)
