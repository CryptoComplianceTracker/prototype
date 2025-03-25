import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { testDatabaseConnection } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add detailed startup logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Test database connection with retries
    log("Testing database connection...");
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      log("Failed to connect to database after retries. Exiting...");
      process.exit(1);
    }
    log("Database connection successful");

    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Error:", err);
      res.status(status).json({ message });
    });

    // Determine if we're in production mode
    const isProduction = process.env.NODE_ENV === "production";
    log(`Running in ${isProduction ? 'production' : 'development'} mode`);

    if (isProduction) {
      log("Setting up static file serving for production build");
      serveStatic(app);
    } else {
      log("Setting up Vite development middleware");
      await setupVite(app, server);
    }

    // Bind to all interfaces on port 5000
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Server successfully started and listening on port ${port}`);
    });
  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
})();