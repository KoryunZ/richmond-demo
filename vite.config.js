import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'node:fs'

// `npm run build`         → dist/         normal build for hosting: the frames travel as one file, frames.pack
// `npm run build:single`  → dist-single/  one self-contained index.html: the frames are written into the page itself

/** writes public/frames.pack into the page as base64 blocks (the film reads them instead of fetching the pack) */
function inlineFrames() {
  return {
    name: 'inline-frames', enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const data = fs.readFileSync('public/frames.pack'), CHUNK = 3 * 1024 * 1024 // a multiple of 3 bytes, so every block is valid base64 on its own
        let tags = ''
        for (let i = 0; i < data.length; i += CHUNK) tags += `<script type="application/x-frames">${data.subarray(i, i + CHUNK).toString('base64')}</script>\n`
        return html.replace('</body>', `${tags}</body>`)
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    base: './',
    publicDir: single ? false : 'public',
    plugins: [react(), single && viteSingleFile({ removeViteModuleLoader: true }), single && inlineFrames()].filter(Boolean),
    build: {
      outDir: single ? 'dist-single' : 'dist',
      target: 'es2022',
      assetsInlineLimit: single ? 100_000_000 : 4096,
      chunkSizeWarningLimit: 20_000,
      reportCompressedSize: false,
    },
    server: { host: '127.0.0.1', port: 5175 },
  }
})
