import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // Proxy para o backend PHP
  //     '/api': {
  //       target: 'https://php8.appdegestao.com.br/web/frenty/erp/relatorios2',
  //       // target: 'https://desenvolvimento.vaplink.com.br/dev/andre/Master/erp/relatorios2',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //       secure: false, // se o certificado SSL do backend não for confiável
  //     },
  //   },
  // },
})
