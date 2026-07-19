import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
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
import {
  ChatRequestSchema,
  detectPromptInjection,
  sanitizeInputPrompt,
  apiRateLimiter,
  chatRateLimiter,
  logger,
  requireAuth,
  enforcePayloadStandards
} from "./server/security.js";

// Load environment variables
dotenv.config();

// Ensure the essential Gemini API key exists, logging securely
if (!process.env.GEMINI_API_KEY) {
  logger.warn("WARNING: GEMINI_API_KEY is not defined in project secrets. AI chat functionalities will fall back or error out.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // ============================================================================
  // 1. CONFIGURE SECURE HEADERS (OWASP Top 10)
  // ============================================================================
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.run.app"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.run.app"],
        connectSrc: ["'self'", "wss:", "ws:", "https://*.run.app", "https://generativelanguage.googleapis.com"]
      }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  }));

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // JSON and URL parsing middlewares with secure payload limits
  app.use(express.json({ limit: "15kb" })); // Limit payload sizes to prevent Denial of Service (DoS)
  app.use(express.urlencoded({ extended: true, limit: "15kb" }));

  // ============================================================================
  // 2. API ENDPOINTS WITH PRODUCTION-GRADE CONTROLS
  // ============================================================================

  // API Route: Live Interactive Data Synchronization
  app.get("/api/live-info", apiRateLimiter, requireAuth, (req, res) => {
    try {
      logger.info("Retrieving live interactive stadium metrics synced successfully");
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
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("Error in /api/live-info endpoint:", errMsg);
      // OWASP: Mask detailed system stack trace/errors from client response
      res.status(500).json({ 
        success: false, 
        error: "An error occurred while retrieving live stadium data." 
      });
    }
  });

  // API Route: AI Copilot Natural Language chat
  app.post("/api/chat", chatRateLimiter, enforcePayloadStandards, requireAuth, async (req, res) => {
    try {
      // Step 1: Validate payload schema using Zod
      const parsedPayload = ChatRequestSchema.safeParse(req.body);
      if (!parsedPayload.success) {
        logger.warn("Payload schema validation failed:", parsedPayload.error.format());
        return res.status(400).json({ 
          success: false, 
          error: "Invalid request format.", 
          details: parsedPayload.error.flatten().fieldErrors 
        });
      }

      const { message, history, setup } = parsedPayload.data;

      // Step 2: Evaluate Prompt Injection or Jailbreak patterns (OWASP LLM Top 10)
      const injectionResult = detectPromptInjection(message);
      if (injectionResult.isMalicious) {
        logger.warn(`Security ALERT: Prompt injection pattern detected! Reason: ${injectionResult.reason}`);
        return res.status(400).json({
          success: false,
          error: "Your message was flagged by safety guidelines. Please rephrase your query without system override instructions."
        });
      }

      // Step 3: Sanitize prompt message before passing it to LLM
      const sanitizedMessage = sanitizeInputPrompt(message);

      // Step 4: Call AI Service
      logger.info(`Processing secure copilot request for User Section: ${setup.seat}`);
      const copilotResponse = await handleCopilotChat({ 
        message: sanitizedMessage, 
        history: history || [], 
        setup 
      });

      res.json({ success: true, ...copilotResponse });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error("Exception handled in /api/chat endpoint:", errMsg);
      // Exclude stack traces, present user-friendly fallback
      res.status(500).json({ 
        success: false, 
        error: "AI multi-factor engine encountered an internal processing limitation. Please try again." 
      });
    }
  });

  // ============================================================================
  // 3. VITE DEV MIDDLEWARE VS PRODUCTION STATIC SERVING
  // ============================================================================
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
    logger.info(`[Stadium Copilot] Server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  logger.error("[Server] Fatal startup error:", err);
});
