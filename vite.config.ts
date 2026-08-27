import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }), 
      react(), 
      babel({
        presets: [reactCompilerPreset()]
      }),
      tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    base: env.VITE_BASE,
    // test: {
    //   globals: true,
    //   css: {
    //     include: /\.css$/
    //   },
    //   deps: {
    //     inline: ['@esri/calcite-components']
    //   },
    //   environment: 'jsdom',
    // },
  }
})