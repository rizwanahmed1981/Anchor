/**
 * Error Handler Service
 *
 * Centralized error handling and logging for the application.
 */

export class ErrorHandler {
  /**
   * Log an error with context
   */
  public logError(error: Error, context?: string): void {
    const timestamp = new Date().toISOString();
    const errorLog = {
      timestamp,
      error: error.message,
      stack: error.stack,
      context,
      severity: 'error'
    };

    console.error(JSON.stringify(errorLog));

    // In a real implementation, this would send to a logging service
    // and potentially trigger alerts for critical errors
  }

  /**
   * Log a warning with context
   */
  public logWarning(warning: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const warningLog = {
      timestamp,
      warning,
      context,
      severity: 'warning'
    };

    console.warn(JSON.stringify(warningLog));
  }

  /**
   * Log an info message with context
   */
  public logInfo(message: string, context?: string): void {
    const timestamp = new Date().toISOString();
    const infoLog = {
      timestamp,
      message,
      context,
      severity: 'info'
    };

    console.info(JSON.stringify(infoLog));
  }

  /**
   * Handle a general error
   */
  public handleError(error: Error, context?: string): Error {
    this.logError(error, context);

    // Return a user-friendly error or re-throw based on requirements
    return error;
  }

  /**
   * Create a custom error with context
   */
  public createError(message: string, context?: string, code?: string): Error {
    const error = new Error(message);
    (error as any).context = context;
    (error as any).code = code;
    return error;
  }
}