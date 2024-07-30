import { defineConfig } from "vite";
import { dreamlandPlugin } from "vite-plugin-dreamland";

export default defineConfig({
    server: {
        hmr: {
            path: "vite-hmr",
        },
    },
    plugins: [dreamlandPlugin()],
});
