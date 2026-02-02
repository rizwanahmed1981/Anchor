/**
 * Sharing History Model
 *
 * Records the history of secret sharing activities for audit and compliance.
 */

export interface SharingEvent {
  /** Unique identifier for the sharing event */
  id: string;

  /** The secret that was shared */
  secretId: string;

  /** The user who initiated the sharing */
  sharerId: string;

  /** The user(s) who received access */
  recipients: string[];

  /** The access rule applied to the sharing */
  accessRuleId: string;

  /** The type of sharing operation */
  operationType: 'SHARE' | 'REVOKE' | 'UPDATE' | 'TRANSFER';

  /** Timestamp when the sharing occurred */
  timestamp: Date;

  /** The reason for sharing */
  reason?: string;

  /** Additional metadata about the sharing */
  metadata?: {
    /** Expiration date if applicable */
    expiresAt?: Date;

    /** Device used for sharing */
    deviceUsed?: string;

    /** IP address of the sharing request */
    ipAddress?: string;

    /** Shared with team members */
    teamMembers?: string[];
  };

  /** Status of the sharing operation */
  status: 'SUCCESS' | 'FAILED' | 'PENDING';

  /** Error details if the operation failed */
  error?: {
    /** Error code */
    code: string;

    /** Error message */
    message: string;

    /** Additional error context */
    context?: any;
  };
}

export interface SharingHistory {
  /** Unique identifier for the sharing history record */
  id: string;

  /** The secret this sharing history relates to */
  secretId: string;

  /** All sharing events for this secret */
  events: SharingEvent[];

  /** Current sharing state */
  currentState: {
    /** Active shares */
    activeShares: string[];

    /** Revoked shares */
    revokedShares: string[];

    /** Total shares */
    totalShares: number;

    /** Last updated timestamp */
    lastUpdated: Date;
  };

  /** When the sharing history was created */
  createdAt: Date;

  /** When the sharing history was last updated */
  updatedAt: Date;
}