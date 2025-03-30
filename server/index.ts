import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // Error handling
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({ message: "Internal server error" });
    });

    // Set up Vite in development mode or serve static files in production
    if (process.env.NODE_ENV !== 'production') {
      await setupVite(app, server);
    } else {
      // In production, serve the static files
      const distPath = path.resolve(__dirname, '../dist');
      app.use(express.static(distPath));
      
      // Handle client-side routing - send index.html for any non-API routes
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.resolve(distPath, 'index.html'));
        }
      });
      
      console.log('Running in production mode, serving static files from:', distPath);
    }

    // Start server
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
})();