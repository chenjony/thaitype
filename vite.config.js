import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    // Fixed filenames so you can instantly tell if GCS is serving the new upload
    rollupOptions: {
      output: {
        entryFileNames: 'assets/thaitype.js',
        assetFileNames: 'assets/thaitype[extname]',
      },
    },
  },
  plugins: [
    {
      name: 'gcs-static-html',
      transformIndexHtml(html) {
        return html
          .replace(/ crossorigin(?:="[^"]*")?/g, '')
          .replace(
            '<title>ThaiType — Thai Typing Practice</title>',
            '<title>ThaiType BUILD-v3</title>',
          )
          .replace(
            '<head>',
            '<head>\n    <!-- BUILD-v3: paths must be ./assets/thaitype.js -->',
          )
      },
    },
  ],
})
