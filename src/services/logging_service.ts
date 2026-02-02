/**
 * Logging Service
 *
 * Provides logging for secret operations and audit trails.
 */

import { Event } from '../models/event';

export class LoggingService {
  private logEntries: Event[] = [];
  private maxLogSize: number = 1000; // Maximum number of log entries to retain

  /**
   * Log a secret storage operation
   */
  public logSecretStored(secretId: string, userId: string, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: 'SECRET_STORED',
      timestamp,
      actorId: userId,
      targetId: secretId,
      details: {
        operation: 'STORE',
        resourceId: secretId
      },
      severity: 'INFO'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log a secret retrieval operation
   */
  public logSecretRetrieved(secretId: string, userId: string, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: 'SECRET_RETRIEVED',
      timestamp,
      actorId: userId,
      targetId: secretId,
      details: {
        operation: 'RETRIEVE',
        resourceId: secretId
      },
      severity: 'INFO'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log a secret deletion operation
   */
  public logSecretDeleted(secretId: string, userId: string, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: 'SECRET_DELETED',
      timestamp,
      actorId: userId,
      targetId: secretId,
      details: {
        operation: 'DELETE',
        resourceId: secretId
      },
      severity: 'INFO'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log a secret update operation
   */
  public logSecretUpdated(secretId: string, userId: string, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: 'SECRET_UPDATED',
      timestamp,
      actorId: userId,
      targetId: secretId,
      details: {
        operation: 'UPDATE',
        resourceId: secretId
      },
      severity: 'INFO'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log an access violation
   */
  public logAccessViolation(secretId: string, userId: string, reason: string, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: 'ACCESS_VIOLATION',
      timestamp,
      actorId: userId,
      targetId: secretId,
      details: {
        operation: 'ACCESS_ATTEMPT',
        resourceId: secretId,
        reason
      },
      severity: 'WARNING'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log a security event
   */
  public logSecurityEvent(eventType: string, userId: string, details: any, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: eventType,
      timestamp,
      actorId: userId,
      targetId: details.resourceId || null,
      details,
      severity: 'INFO'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Log an error
   */
  public logError(error: Error, context: string, userId?: string, timestamp: Date = new Date()): void {
    const logEntry: Event = {
      id: this.generateEventId(),
      type: 'ERROR',
      timestamp,
      actorId: userId || 'SYSTEM',
      targetId: null,
      details: {
        context,
        message: error.message,
        stack: error.stack ? error.stack.substring(0, 500) : undefined // Limit stack trace length
      },
      severity: 'ERROR'
    };

    this.addLogEntry(logEntry);
  }

  /**
   * Get log entries for a specific secret
   */
  public getLogEntriesForSecret(secretId: string): Event[] {
    return this.logEntries.filter(entry => entry.targetId === secretId);
  }

  /**
   * Get log entries for a specific user
   */
  public getLogEntriesForUser(userId: string): Event[] {
    return this.logEntries.filter(entry => entry.actorId === userId);
  }

  /**
   * Get all log entries
   */
  public getAllLogEntries(): Event[] {
    return [...this.logEntries]; // Return a copy to prevent external modification
  }

  /**
   * Get log entries by severity
   */
  public getLogEntriesBySeverity(severity: string): Event[] {
    return this.logEntries.filter(entry => entry.severity === severity);
  }

  /**
   * Add a log entry and manage log size
   */
  private addLogEntry(entry: Event): void {
    this.logEntries.push(entry);

    // Trim log if it exceeds maximum size
    if (this.logEntries.length > this.maxLogSize) {
      this.logEntries = this.logEntries.slice(-this.maxLogSize);
    }
  }

  /**
   * Generate a unique event ID
   */
  private generateEventId(): string {
    return 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Clear all log entries
   */
  public clearLogs(): void {
    this.logEntries = [];
  }
}