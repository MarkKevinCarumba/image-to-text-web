import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const srcPath = path.resolve(__dirname, "src");

// Automatically map every folder in src to an alias
const aliases = fs
  .readdirSync(srcPath, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .reduce((acc, dirent) => {
    acc[dirent.name] = path.resolve(srcPath, dirent.name);
    return acc;
  }, {});

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: aliases,
  },
  plugins: [react()],
});
