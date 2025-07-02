// Production configuration and environment setup
export const PRODUCTION_CONFIG = {
  // Site URLs
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.vercel.app",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://your-site.vercel.app/api",

  // Feature flags
  FEATURES: {
    REAL_TIME_SYNC: true,
    OFFLINE_SUPPORT: true,
    AUTO_BACKUP: true,
    ANALYTICS: true,
    ERROR_REPORTING: true,
  },

  // Performance settings
  PERFORMANCE: {
    SYNC_INTERVAL: 10000, // 10 seconds
    CACHE_DURATION: 300000, // 5 minutes
    MAX_RETRIES: 3,
    TIMEOUT: 30000, // 30 seconds
  },

  // Storage limits
  STORAGE: {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_CONTENT_SIZE: 1024 * 1024, // 1MB
    BACKUP_RETENTION: 30, // days
  },

  // Security settings
  SECURITY: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
}

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview"

// Logging configuration
export const LOG_LEVEL = IS_PRODUCTION ? "error" : "debug"

// Analytics configuration
export const ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
  VERCEL_ANALYTICS: true,
  CUSTOM_EVENTS: true,
}

// Error reporting configuration
export const ERROR_REPORTING = {
  ENABLED: IS_PRODUCTION,
  SAMPLE_RATE: 0.1, // 10% of errors
  IGNORE_ERRORS: ["Network request failed", "Loading chunk", "Script error"],
}

// Performance monitoring
export const PERFORMANCE_CONFIG = {
  WEB_VITALS: true,
  REAL_USER_MONITORING: IS_PRODUCTION,
  SYNTHETIC_MONITORING: IS_PRODUCTION,
}

// Content delivery
export const CDN_CONFIG = {
  IMAGE_OPTIMIZATION: true,
  STATIC_ASSETS_CDN: true,
  CACHE_HEADERS: {
    STATIC: "public, max-age=31536000, immutable",
    DYNAMIC: "public, max-age=0, must-revalidate",
    API: "public, max-age=60, s-maxage=300",
  },
}

// Database/Storage configuration
export const STORAGE_CONFIG = {
  PROVIDER: "localStorage", // Can be upgraded to cloud storage
  BACKUP_PROVIDER: "vercel-blob", // For future cloud backups
  SYNC_STRATEGY: "optimistic", // optimistic | pessimistic
  CONFLICT_RESOLUTION: "last-write-wins",
}

// Monitoring and alerts
export const MONITORING_CONFIG = {
  UPTIME_CHECKS: IS_PRODUCTION,
  PERFORMANCE_BUDGET: {
    FCP: 1500, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    CLS: 0.1, // Cumulative Layout Shift
    FID: 100, // First Input Delay
  },
  ALERTS: {
    ERROR_RATE_THRESHOLD: 0.05, // 5%
    RESPONSE_TIME_THRESHOLD: 3000, // 3 seconds
    UPTIME_THRESHOLD: 0.99, // 99%
  },
}

// Export environment-specific config
export const getConfig = () => {
  if (IS_PRODUCTION) {
    return {
      ...PRODUCTION_CONFIG,
      LOG_LEVEL: "error",
      DEBUG: false,
    }
  }

  if (IS_PREVIEW) {
    return {
      ...PRODUCTION_CONFIG,
      LOG_LEVEL: "warn",
      DEBUG: true,
    }
  }

  // Development
  return {
    ...PRODUCTION_CONFIG,
    LOG_LEVEL: "debug",
    DEBUG: true,
    FEATURES: {
      ...PRODUCTION_CONFIG.FEATURES,
      ANALYTICS: false,
      ERROR_REPORTING: false,
    },
  }
}
