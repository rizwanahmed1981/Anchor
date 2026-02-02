/**
 * Environment Configuration Service
 *
 * Manages application configuration from environment variables and defaults.
 */

export interface AppConfig {
  /** Application name */
  appName: string;

  /** Application version */
  version: string;

  /** Environment (development, staging, production) */
  environment: 'development' | 'staging' | 'production';

  /** Logging level */
  logLevel: 'debug' | 'info' | 'warn' | 'error';

  /** Feature flags */
  features: {
    /** Enable/disable zero-knowledge mode */
    zeroKnowledge: boolean;

    /** Enable/disable risk detection */
    riskDetection: boolean;

    /** Enable/disable sharing features */
    sharing: boolean;

    /** Enable/disable recovery mechanisms */
    recovery: boolean;
  };

  /** Security settings */
  security: {
    /** Maximum number of failed login attempts before lockout */
    maxLoginAttempts: number;

    /** Lockout duration in minutes */
    lockoutDuration: number;

    /** Minimum password length */
    minPasswordLength: number;

    /** Require secure context (HTTPS) */
    requireSecureContext: boolean;
  };

  /** Performance settings */
  performance: {
    /** Maximum concurrent requests */
    maxConcurrentRequests: number;

    /** Timeout for API calls in milliseconds */
    apiTimeout: number;

    /** Cache TTL in seconds */
    cacheTtl: number;
  };
}

export class EnvironmentConfig {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from environment variables with defaults
   */
  private loadConfig(): AppConfig {
    return {
      appName: process.env.APP_NAME || 'Anchor Password Manager',
      version: process.env.VERSION || '0.1.0',
      environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
      logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
      features: {
        zeroKnowledge: this.getBooleanEnv('FEATURE_ZERO_KNOWLEDGE', true),
        riskDetection: this.getBooleanEnv('FEATURE_RISK_DETECTION', true),
        sharing: this.getBooleanEnv('FEATURE_SHARING', false),
        recovery: this.getBooleanEnv('FEATURE_RECOVERY', true),
      },
      security: {
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
        lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '30', 10),
        minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH || '8', 10),
        requireSecureContext: this.getBooleanEnv('REQUIRE_SECURE_CONTEXT', true),
      },
      performance: {
        maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '100', 10),
        apiTimeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
        cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10),
      }
    };
  }

  /**
   * Get a boolean environment variable with default
   */
  private getBooleanEnv(name: string, defaultValue: boolean): boolean {
    const value = process.env[name];
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  /**
   * Get the complete configuration
   */
  public getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get a specific configuration value
   */
  public get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.config[key];
  }

  /**
   * Get a nested configuration value
   */
  public getNested<T extends keyof AppConfig['features']>(key: T): AppConfig['features'][T] {
    return this.config.features[key];
  }
}