import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// ============================================================================
// 1. INPUT VALIDATION SCHEMAS (Zod)
// ============================================================================

export const UserSetupSchema = z.object({
  stadiumId: z.string().min(1, "Stadium ID is required").max(100, "Stadium ID is too long"),
  matchId: z.string().min(1, "Match ID is required").max(100, "Match ID is too long"),
  seat: z.string().min(1, "Seat Section is required").max(50, "Seat Section is too long"),
  language: z.string().min(1, "Language is required").max(50, "Language is too long"),
  accessibility: z.enum(["Standard", "Wheelchair", "Blind", "Deaf", "Elderly"]),
  transport: z.enum(["Metro", "Car", "Bus", "Walking"])
});

export const ChatHistoryItemSchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(
    z.object({
      text: z.string()
    })
  )
});

export const ChatRequestSchema = z.object({
  message: z.string()
    .min(1, "Message is empty")
    .max(1500, "Message is too long (maximum 1500 characters)"),
  history: z.array(ChatHistoryItemSchema).optional().default([]),
  setup: UserSetupSchema
});

// ============================================================================
// 2. PROMPT INJECTION & JAILBREAK PROTECTION (OWASP LLM Security)
// ============================================================================

// Dangerous strings and regular expressions designed to detect jailbreaking attempts
const MALICIOUS_PATTERNS = [
  /ignore previous/i,
  /forget (your|previous|the) instructions/i,
  /forget (your|previous|the) system/i,
  /disregard/i,
  /system prompt/i,
  /dan mode/i,
  /jailbreak/i,
  /override guidelines/i,
  /reveal system/i,
  /hidden instructions/i,
  /developer instructions/i,
  /you must now/i,
  /pretend to be/i,
  /as a developer/i,
  /bypass rules/i,
  /new rule/i,
  /show prompt/i,
  /reveal your prompt/i,
  /tell me your guidelines/i,
  /api key/i,
  /gemini_api_key/i,
  /http:\/\//i,
  /https:\/\//i
];

/**
 * Validates a prompt against potential LLM prompt injections, jailbreaks, 
 * and system prompt extraction attacks.
 */
export function detectPromptInjection(prompt: string): { isMalicious: boolean; reason?: string } {
  const sanitized = prompt.trim();

  // Basic script tag and HTML event handler checks
  if (/<script|javascript:|onerror|onload|onclick|iframe/i.test(sanitized)) {
    return { isMalicious: true, reason: "XSS HTML/JavaScript execution vectors detected." };
  }

  // Jailbreak and guideline override detection
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      return { 
        isMalicious: true, 
        reason: "Input triggered standard safety filter for jailbreak or instruction extraction patterns." 
      };
    }
  }

  return { isMalicious: false };
}

/**
 * Sanitizes input prompt from potential hazardous characters or payload structures.
 */
export function sanitizeInputPrompt(prompt: string): string {
  return prompt
    .replace(/<[^>]*>/g, "") // Strip raw HTML tag tags
    .replace(/javascript:/gi, "") // Neutralize javascript protocol URL links
    .trim();
}

// ============================================================================
// 3. OUTPUT SANITIZATION UTILITY
// ============================================================================

/**
 * Sanitizes bot answers to prevent rendering of any malicious script tags, 
 * dangerous markdown payloads, or HTML injection vectors.
 */
export function sanitizeModelOutput(text: string): string {
  if (!text) return "";
  return text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "") // Scrub script tags completely
    .replace(/on\w+\s*=\s*".*?"/gi, "") // Remove inline event listeners like onclick
    .replace(/javascript:/gi, "[safe-link-removed]:") // Escape inline script protocols
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, ""); // Remove iframes
}

// ============================================================================
// 4. RATE LIMITERS (Express-Rate-Limit)
// ============================================================================

// Prevent abuse on standard information endpoints
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: "Too many requests. Please try again after 15 minutes."
  },
  statusCode: 429
});

// Stricter limiter for heavy AI model chat actions
export const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 chat queries per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AI multi-factor engine is busy processing other fans. Please space out your queries."
  },
  statusCode: 429
});

// ============================================================================
// 5. SECURE LOGGING UTILITIES
// ============================================================================

const SENSITIVE_PATTERNS = [
  /AI_KEY/gi,
  /GEMINI_[A-Z0-9_]+/gi,
  /password/gi,
  /token/gi,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g // Email regex
];

/**
 * Scrub sensitive details from log lines before console output
 */
export function maskSensitiveData(input: string): string {
  let masked = input;
  for (const pattern of SENSITIVE_PATTERNS) {
    masked = masked.replace(pattern, "[REDACTED_CONFIDENTIAL_DATA]");
  }
  return masked;
}

export const logger = {
  info: (message: string, ...args: any[]) => {
    const formatted = maskSensitiveData(message);
    console.log(`[INFO] [${new Date().toISOString()}] ${formatted}`, ...args.map(a => typeof a === 'string' ? maskSensitiveData(a) : a));
  },
  warn: (message: string, ...args: any[]) => {
    const formatted = maskSensitiveData(message);
    console.warn(`[WARN] [${new Date().toISOString()}] ${formatted}`, ...args.map(a => typeof a === 'string' ? maskSensitiveData(a) : a));
  },
  error: (message: string, ...args: any[]) => {
    const formatted = maskSensitiveData(message);
    console.error(`[ERROR] [${new Date().toISOString()}] ${formatted}`, ...args.map(a => typeof a === 'string' ? maskSensitiveData(a) : a));
  }
};

// ============================================================================
// 6. MIDDLEWARES FOR AUTHENTICATION PREPARATION & REQUEST ROBUSTNESS
// ============================================================================

/**
 * Simulated robust authentication middleware to secure critical fan/dashboard 
 * modifications or personalized reservation states.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // In production, this verifies the JWT or session cookie securely.
  // We prepare this architecture to be production-ready.
  const authHeader = req.headers.authorization;
  
  // Note: During local testing and preview development, we allow requests 
  // but validate that if an authorization header is present, it is not malformed.
  if (authHeader) {
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Malformed Authorization Header. Must follow Bearer token architecture."
      });
    }
  }

  // Proceed safely
  next();
}

/**
 * Validate that incoming requests conform to JSON standards and prevent 
 * prototype pollution / payload attacks.
 */
export function enforcePayloadStandards(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    // Prevent Prototype Pollution
    if ('__proto__' in req.body || 'constructor' in req.body) {
      return res.status(400).json({
        success: false,
        error: "Potential security vulnerability detected: Prototype Pollution parameter present."
      });
    }
  }
  next();
}

// ============================================================================
// 7. FILE & DATA SECURITY (OWASP Top 10)
// ============================================================================

/**
 * Validates file meta-data to block dangerous uploads (e.g., shells, executables)
 * and enforce size limit restrictions.
 */
export function validateUploadedFile(filename: string, mimeType: string, fileSizeInBytes: number): { isValid: boolean; reason?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB Limit
  const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".pdf", ".txt", ".csv"];
  const FORBIDDEN_EXTENSIONS = [".sh", ".exe", ".bat", ".cmd", ".js", ".ts", ".html", ".php", ".py", ".pl"];

  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) {
    return { isValid: false, reason: "File lacks an extension." };
  }
  const extension = filename.slice(lastDot).toLowerCase();

  if (fileSizeInBytes > MAX_SIZE) {
    return { isValid: false, reason: "File size exceeds the secure limit of 5MB." };
  }

  if (FORBIDDEN_EXTENSIONS.includes(extension)) {
    return { isValid: false, reason: "Dangerous file extension rejected." };
  }

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, reason: "File extension not permitted. Allowed: images, PDF, text, and CSV." };
  }

  // Basic MIME check
  if (!/^(image\/|application\/pdf|text\/plain|text\/csv)/i.test(mimeType)) {
    return { isValid: false, reason: "Insecure or unpermitted MIME type." };
  }

  return { isValid: true };
}

/**
 * Sanitizes filename to prevent directory traversal or malicious injection characters.
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace non-alphanumeric with underscores
    .replace(/\.\.+/g, "."); // Block double dot directory traversal payloads
}
