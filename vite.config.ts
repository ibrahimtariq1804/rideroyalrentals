import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  assetsInclude: ['**/*.glb'],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three')) return 'three'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion-scroll'
          if (id.includes('node_modules/motion')) return 'motion-ui'
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    allowedHosts: true,
    host: '127.0.0.1',
    port: 4173,
  },
})
