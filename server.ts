import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { handleCopilotChat } from "./server/ai.js";
import { 
  STADIUMS, 
  MATCHES, 
  FOOD_STALLS, 
  WASHROOMS, 
  FACILITIES, 
  TRANSPORT_OPTIONS, 
  STADIUM_POLICIES 
} from "./server/data.js";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Live Interactive Data Synchronization
  app.get("/api/live-info", (req, res) => {
    try {
      res.json({
        success: true,
        stadiums: STADIUMS,
        matches: MATCHES,
        foodStalls: FOOD_STALLS,
        washrooms: WASHROOMS,
        facilities: FACILITIES,
        transportOptions: TRANSPORT_OPTIONS,
        policies: STADIUM_POLICIES
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: AI Copilot Natural Language chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, setup } = req.body;
      if (!message || !setup) {
        return res.status(400).json({ success: false, error: "Missing required fields: message, setup" });
      }

      const copilotResponse = await handleCopilotChat({ message, history: history || [], setup });
      res.json({ success: true, ...copilotResponse });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || err });
    }
  });

  // Vite development middleware vs Static Production bundle serving
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Configuring Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Configuring Production Static Content Serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Stadium Copilot] Server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] Fatal startup error:", err);
});
