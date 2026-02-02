/**
 * Dormant Secret Detection Service
 *
 * Identifies secrets that haven't been accessed in a long time.
 */

import { Secret } from '../models/secret';
import { LoggingService } from './logging_service';

export class DormantSecretService {
  private loggingService: LoggingService;

  constructor(loggingService?: LoggingService) {
    this.loggingService = loggingService || new LoggingService();
  }

  /**
   * Detect dormant secrets based on access patterns
   */
  public async detectDormantSecrets(secrets: Secret[], userId: string, thresholdDays: number = 90): Promise<{
    dormantSecrets: string[];
    recommendations: string[];
    statistics: {
      totalSecrets: number;
      dormantCount: number;
      avgDaysInactive: number;
    };
  }> {
    try {
      const dormantSecrets: string[] = [];
      const recommendations: string[] = [];
      let totalDaysInactive = 0;

      for (const secret of secrets) {
        const isDormant = this.isSecretDormant(secret, thresholdDays);

        if (isDormant) {
          dormantSecrets.push(secret.id);

          // Add recommendations based on the type of dormant secret
          if (secret.metadata.type === 'password') {
            recommendations.push(`Password "${secret.metadata.context}" hasn't been accessed in ${this.calculateDaysSinceAccess(secret)} days - consider changing it`);
          } else {
            recommendations.push(`Secret "${secret.metadata.context}" hasn't been accessed in ${this.calculateDaysSinceAccess(secret)} days`);
          }
        }

        // Calculate total inactive days for statistics
        const daysInactive = this.calculateDaysSinceAccess(secret);
        totalDaysInactive += daysInactive;
      }

      const avgDaysInactive = secrets.length > 0 ? Math.round(totalDaysInactive / secrets.length) : 0;

      // Log the detection
      this.loggingService.logSecurityEvent('DORMANT_SECRET_DETECTION', userId, {
        dormantSecrets: dormantSecrets,
        totalSecrets: secrets.length,
        dormantCount: dormantSecrets.length,
        avgDaysInactive
      });

      return {
        dormantSecrets,
        recommendations,
        statistics: {
          totalSecrets: secrets.length,
          dormantCount: dormantSecrets.length,
          avgDaysInactive
        }
      };
    } catch (error) {
      this.loggingService.logError(error as Error, 'detectDormantSecrets', userId);
      throw error;
    }
  }

  /**
   * Check if a secret is dormant based on its last access time
   */
  public isSecretDormant(secret: Secret, thresholdDays: number = 90): boolean {
    const lastAccessed = secret.metadata.auditHistory.lastAccessed;

    if (!lastAccessed) {
      // If no last access time, treat as dormant (assuming it's old)
      return true;
    }

    const now = new Date();
    const daysSinceAccess = Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));

    return daysSinceAccess >= thresholdDays;
  }

  /**
   * Calculate days since last access
   */
  public calculateDaysSinceAccess(secret: Secret): number {
    const lastAccessed = secret.metadata.auditHistory.lastAccessed;

    if (!lastAccessed) {
      return 365; // Assume 1 year if no access time
    }

    const now = new Date();
    return Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get detailed information about dormant secrets
   */
  public async getDormantSecretDetails(secrets: Secret[], userId: string): Promise<{
    secretDetails: Array<{
      secretId: string;
      daysInactive: number;
      lastAccessed: Date | null;
      type: string;
      context: string;
    }>;
    recommendations: string[];
  }> {
    const secretDetails: Array<{
      secretId: string;
      daysInactive: number;
      lastAccessed: Date | null;
      type: string;
      context: string;
    }> = [];

    const recommendations: string[] = [];

    for (const secret of secrets) {
      const daysInactive = this.calculateDaysSinceAccess(secret);

      secretDetails.push({
        secretId: secret.id,
        daysInactive,
        lastAccessed: secret.metadata.auditHistory.lastAccessed,
        type: secret.metadata.type,
        context: secret.metadata.context
      });

      // Generate recommendations based on age
      if (daysInactive > 365) {
        recommendations.push(`Secret "${secret.metadata.context}" has been dormant for over a year - consider archiving or removing`);
      } else if (daysInactive > 180) {
        recommendations.push(`Secret "${secret.metadata.context}" has been dormant for ${daysInactive} days - review its necessity`);
      }
    }

    return {
      secretDetails,
      recommendations
    };
  }

  /**
   * Recommend actions for dormant secrets
   */
  public getDormantSecretRecommendations(secret: Secret): string[] {
    const recommendations: string[] = [];
    const daysInactive = this.calculateDaysSinceAccess(secret);

    if (daysInactive > 365) {
      recommendations.push('Archive this secret as it has been dormant for over a year');
      recommendations.push('Consider removing it if no longer needed');
    } else if (daysInactive > 180) {
      recommendations.push('Review whether this secret is still needed');
      recommendations.push('Consider changing it if it\'s a password');
    } else if (daysInactive > 90) {
      recommendations.push('Consider reviewing this secret periodically');
    }

    return recommendations;
  }
}