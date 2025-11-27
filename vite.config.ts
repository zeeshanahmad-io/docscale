import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import config from './keystatic.config';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    compression(),
    {
      name: 'keystatic-middleware',
      configureServer(server: any) {
        server.middlewares.use('/api/keystatic', async (req: any, res: any) => {
          try {
            const host = req.headers.host || 'localhost:8080';
            const url = `http://${host}${req.originalUrl}`;

            // Read body if method is not GET/HEAD
            let body = null;
            if (req.method !== 'GET' && req.method !== 'HEAD') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              body = Buffer.concat(buffers);
            }

            const webReq = new Request(url, {
              method: req.method,
              headers: req.headers as any,
              body: body,
            });

            const handler = makeGenericAPIRouteHandler({ config });
            const webRes = await handler(webReq);

            res.statusCode = webRes.status;
            if (webRes.headers) {
              const headers = webRes.headers as any;
              if (typeof headers.forEach === 'function') {
                headers.forEach((val: any, key: any) => res.setHeader(key, val));
              } else if (typeof headers.entries === 'function') {
                for (const [key, val] of headers.entries()) {
                  res.setHeader(key, val);
                }
              } else {
                Object.entries(headers).forEach(([key, val]) => {
                  res.setHeader(key, val as any);
                });
              }
            }

            if (webRes.body) {
              if (typeof (webRes.body as any).getReader === 'function') {
                const reader = (webRes.body as any).getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
              } else {
                res.write(webRes.body);
              }
            }
            res.end();
          } catch (e) {
            console.error('Keystatic Middleware Error:', e);
            res.statusCode = 500;
            res.end(e instanceof Error ? e.message : 'Internal Server Error');
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'framer-motion', 'lucide-react'],
        },
      },
    },
  },
}));