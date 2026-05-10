import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import geminiHandler from './api/gemini'

const geminiDevApi = (): Plugin => ({
  name: 'gemini-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/gemini', async (request, response) => {
      let rawBody = '';

      request.setEncoding('utf8');
      request.on('data', (chunk) => {
        rawBody += chunk;
      });
      request.on('end', async () => {
        let body: unknown = {};

        if (rawBody) {
          try {
            body = JSON.parse(rawBody);
          } catch {
            response.statusCode = 400;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ error: 'Invalid JSON request body' }));
            return;
          }
        }

        await geminiHandler(
          { method: request.method, body },
          {
            status(code) {
              response.statusCode = code;
              return this;
            },
            setHeader(name, value) {
              response.setHeader(name, value);
            },
            json(jsonBody) {
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify(jsonBody));
            },
            send(textBody) {
              response.end(textBody);
            },
            end() {
              response.end();
            },
          }
        );
      });
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env.GEMINI_API_KEY ??= env.GEMINI_API_KEY;

  return {
    plugins: [react(), geminiDevApi()],
    publicDir: 'public',
    base: process.env.NODE_ENV === 'production' ? '/ecotrack-ai/' : './',
    build: {
      outDir: 'dist'
    }
  };
})
