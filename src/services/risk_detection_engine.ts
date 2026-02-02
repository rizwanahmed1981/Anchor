/**
 * Risk Detection Engine
 *
 * Implements proactive risk detection for credential reuse, weak credentials,
 * dormant secrets, and overexposed sharing.
 */

import { Secret } from '../models/secret';
import { RiskAnalysis } from '../models/risk_analysis';
import { LoggingService } from './logging_service';

export class RiskDetectionEngine {
  private loggingService: LoggingService;

  constructor(loggingService?: LoggingService) {
    this.loggingService = loggingService || new LoggingService();
  }

  /**
   * Analyze a secret for potential risks
   */
  public async analyzeSecretRisk(secret: Secret, userId: string): Promise<RiskAnalysis> {
    try {
      // Initialize risk analysis
      const riskAnalysis: RiskAnalysis = {
        id: this.generateRiskId(),
        secretId: secret.id,
        userId: userId,
        timestamp: new Date(),
        riskScore: 0,
        riskCategories: [],
        findings: [],
        recommendations: [],
        severity: 'LOW'
      };

      // Check for credential reuse
      const reuseRisk = await this.checkCredentialReuse(secret, userId);
      if (reuseRisk.score > 0) {
        riskAnalysis.riskScore += reuseRisk.score;
        riskAnalysis.riskCategories.push('credential_reuse');
        riskAnalysis.findings.push(reuseRisk.finding);
        riskAnalysis.recommendations.push(...reuseRisk.recommendations);
      }

      // Check for weak credentials
      const weakCredentialsRisk = await this.checkWeakCredentials(secret);
      if (weakCredentialsRisk.score > 0) {
        riskAnalysis.riskScore += weakCredentialsRisk.score;
        riskAnalysis.riskCategories.push('weak_credentials');
        riskAnalysis.findings.push(weakCredentialsRisk.finding);
        riskAnalysis.recommendations.push(...weakCredentialsRisk.recommendations);
      }

      // Check for dormant secrets
      const dormantRisk = await this.checkDormantSecret(secret);
      if (dormantRisk.score > 0) {
        riskAnalysis.riskScore += dormantRisk.score;
        riskAnalysis.riskCategories.push('dormant_secret');
        riskAnalysis.findings.push(dormantRisk.finding);
        riskAnalysis.recommendations.push(...dormantRisk.recommendations);
      }

      // Determine severity based on risk score
      riskAnalysis.severity = this.determineSeverity(riskAnalysis.riskScore);

      // Log the analysis
      this.loggingService.logSecurityEvent('RISK_ANALYSIS_COMPLETED', userId, {
        secretId: secret.id,
        riskScore: riskAnalysis.riskScore,
        severity: riskAnalysis.severity,
        riskCategories: riskAnalysis.riskCategories
      });

      return riskAnalysis;
    } catch (error) {
      this.loggingService.logError(error as Error, 'analyzeSecretRisk', userId);
      throw error;
    }
  }

  /**
   * Check for credential reuse across user's secrets
   */
  private async checkCredentialReuse(secret: Secret, userId: string): Promise<{
    score: number;
    finding: string;
    recommendations: string[];
  }> {
    // In a real implementation, this would:
    // 1. Compare the secret data against other secrets in the user's collection
    // 2. Check against known compromised credential databases
    // 3. Detect patterns of reuse across different contexts

    // For demonstration, we'll simulate a risk check
    const isReused = Math.random() > 0.7; // 30% chance of reuse
    const score = isReused ? 30 : 0;

    if (isReused) {
      return {
        score,
        finding: `Potential credential reuse detected in secret ${secret.id}`,
        recommendations: [
          'Change this password immediately',
          'Avoid reusing passwords across different accounts',
          'Use a password manager to generate unique passwords'
        ]
      };
    }

    return {
      score: 0,
      finding: 'No credential reuse detected',
      recommendations: []
    };
  }

  /**
   * Check for weak credentials (password strength, patterns, etc.)
   */
  private async checkWeakCredentials(secret: Secret): Promise<{
    score: number;
    finding: string;
    recommendations: string[];
  }> {
    // In a real implementation, this would:
    // 1. Analyze password strength using entropy calculations
    // 2. Check for common patterns (123456, qwerty, etc.)
    // 3. Check for dictionary words
    // 4. Evaluate complexity requirements

    // For demonstration, we'll simulate a risk check
    const isWeak = Math.random() > 0.8; // 20% chance of weakness
    const score = isWeak ? 25 : 0;

    if (isWeak) {
      return {
        score,
        finding: `Weak credentials detected in secret ${secret.id}`,
        recommendations: [
          'Use a stronger password with more complexity',
          'Include uppercase, lowercase, numbers, and symbols',
          'Avoid common patterns and dictionary words'
        ]
      };
    }

    return {
      score: 0,
      finding: 'Credentials appear to be strong',
      recommendations: []
    };
  }

  /**
   * Check for dormant secrets (not accessed in a long time)
   */
  private async checkDormantSecret(secret: Secret): Promise<{
    score: number;
    finding: string;
    recommendations: string[];
  }> {
    // In a real implementation, this would:
    // 1. Check the last accessed timestamp
    // 2. Compare against configured thresholds (e.g., 90 days)
    // 3. Consider the secret type and importance

    // For demonstration, we'll simulate a risk check
    const lastAccessed = secret.metadata.auditHistory.lastAccessed;
    const now = new Date();
    const daysSinceAccess = lastAccessed ?
      Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const isDormant = daysSinceAccess > 90; // More than 90 days since access
    const score = isDormant ? 20 : 0;

    if (isDormant) {
      return {
        score,
        finding: `Dormant secret detected (${daysSinceAccess} days since last access)`,
        recommendations: [
          'Review the secret for continued necessity',
          'Consider removing if no longer needed',
          'Update access permissions if appropriate'
        ]
      };
    }

    return {
      score: 0,
      finding: 'Secret accessed recently',
      recommendations: []
    };
  }

  /**
   * Generate a unique risk analysis ID
   */
  private generateRiskId(): string {
    return 'risk_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Determine severity level based on risk score
   */
  private determineSeverity(riskScore: number): string {
    if (riskScore >= 70) {
      return 'HIGH';
    } else if (riskScore >= 40) {
      return 'MEDIUM';
    } else if (riskScore >= 10) {
      return 'LOW';
    }
    return 'INFO';
  }

  /**
   * Batch analyze multiple secrets for risks
   */
  public async batchAnalyzeSecrets(secrets: Secret[], userId: string): Promise<RiskAnalysis[]> {
    const riskAnalyses: RiskAnalysis[] = [];

    for (const secret of secrets) {
      try {
        const analysis = await this.analyzeSecretRisk(secret, userId);
        riskAnalyses.push(analysis);
      } catch (error) {
        this.loggingService.logError(error as Error, 'batchAnalyzeSecrets', userId);
        // Continue with other secrets
      }
    }

    return riskAnalyses;
  }

  /**
   * Get risk statistics for a user
   */
  public async getUserRiskStats(userId: string): Promise<{
    totalSecrets: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    averageRiskScore: number;
  }> {
    // In a real implementation, this would query the database for risk analysis records
    // For now, we'll simulate some statistics

    const totalSecrets = Math.floor(Math.random() * 50) + 10;
    const highRiskCount = Math.floor(Math.random() * 5);
    const mediumRiskCount = Math.floor(Math.random() * 10);
    const lowRiskCount = totalSecrets - highRiskCount - mediumRiskCount;
    const averageRiskScore = Math.floor(Math.random() * 50) + 10;

    return {
      totalSecrets,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      averageRiskScore
    };
  }
}