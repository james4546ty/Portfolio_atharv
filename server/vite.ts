import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try typical production build output first
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  // Fallbacks for environments without a build step (e.g., Replit preview)
  const publicPath = path.resolve(import.meta.dirname, "public");
  const clientPath = path.resolve(import.meta.dirname, "..", "client");

  let staticPath: string | null = null;

  if (fs.existsSync(distPath)) {
    staticPath = distPath;
  } else if (fs.existsSync(publicPath)) {
    staticPath = publicPath;
  } else if (fs.existsSync(path.resolve(clientPath, "index.html"))) {
    // Serve directly from client directory when no dist/public exists
    staticPath = clientPath;
  }

  if (staticPath) {
    app.use(express.static(staticPath));

    // Fall through to index.html for client-side routing
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(staticPath!, "index.html"));
    });
  } else {
    // Last resort: return 404 (should rarely happen)
    app.use("*", (_req, res) => {
      res.status(404).json({ message: "Not found" });
    });
  }
}
