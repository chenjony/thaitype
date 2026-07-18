import { defineConfig } from 'vite'

function certificateDownloadHeaders() {
  const middleware = (request, response, next) => {
    if (request.url?.split('?')[0] === '/assets/thaitype-vip-certificate.png') {
      response.setHeader('Content-Type', 'image/png')
      response.setHeader('Content-Disposition', 'attachment; filename="ThaiType-VIP-Certificate.png"')
      response.setHeader('Cache-Control', 'no-store')
    }
    next()
  }
  return {
    name: 'certificate-download-headers',
    configureServer(server) { server.middlewares.use(middleware) },
    configurePreviewServer(server) { server.middlewares.use(middleware) },
  }
}

export default defineConfig({ base: '/', plugins: [certificateDownloadHeaders()] })
