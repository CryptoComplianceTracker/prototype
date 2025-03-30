import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function startProductionServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // Serve static files from the 'dist' directory
    const distPath = path.resolve(__dirname, "../dist");
    app.use(express.static(distPath));
    
    // Handle client-side routing by serving index.html for all non-API routes
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.resolve(distPath, "index.html"));
      }
    });
    
    // Start server
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    server.listen({
      port: port,
      host: "0.0.0.0"
    }, () => {
      console.log(`Production server started on port ${port}`);
    });
  } catch (error) {
    console.error("Production server startup error:", error);
    process.exit(1);
  }
}

startProductionServer();