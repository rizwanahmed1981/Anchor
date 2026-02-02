/**
 * Risk Analysis Model
 *
 * Represents the analysis of a secret for potential security risks.
 */

export interface RiskFinding {
  /** Unique identifier for the finding */
  id: string;

  /** The type of finding (e.g., credential_reuse, weak_password) */
  type: string;

  /** Description of the finding */
  description: string;

  /** Severity level of the finding */
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /** Timestamp when the finding was detected */
  timestamp: Date;

  /** Additional context or evidence */
  context?: any;
}

export interface RiskRecommendation {
  /** Unique identifier for the recommendation */
  id: string;

  /** The type of recommendation */
  type: string;

  /** Description of the recommendation */
  description: string;

  /** Priority level (low, medium, high) */
  priority: 'LOW' | 'MEDIUM' | 'HIGH';

  /** Timestamp when the recommendation was generated */
  timestamp: Date;

  /** Action required */
  action?: string;
}

export interface RiskAnalysis {
  /** Unique identifier for the risk analysis */
  id: string;

  /** The secret this analysis applies to */
  secretId: string;

  /** The user who owns the secret */
  userId: string;

  /** Timestamp when the analysis was performed */
  timestamp: Date;

  /** Overall risk score (0-100) */
  riskScore: number;

  /** Categories of risks detected */
  riskCategories: string[];

  /** Specific findings from the analysis */
  findings: RiskFinding[];

  /** Recommendations to address risks */
  recommendations: RiskRecommendation[];

  /** Overall severity level */
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /** Additional metadata */
  metadata?: {
    /** Confidence level in the analysis */
    confidence?: number;

    /** Analysis duration in milliseconds */
    analysisTime?: number;

    /** Source of the analysis */
    source?: string;
  };
}