/**
 * AccessRule Model
 *
 * A dynamic rule defining who can access a secret, under what conditions,
 * and for how long.
 */

export interface AccessRule {
  /** Unique identifier for the access rule */
  id: string;

  /** The secret this rule applies to */
  secretId: string;

  /** The identity that is granted access */
  grantedTo: string;

  /** Conditions for access */
  conditions: {
    /** Time limits */
    timeLimits?: {
      /** Start time */
      startTime?: Date;

      /** End time */
      endTime?: Date;
    };

    /** Device restrictions */
    deviceRestrictions?: string[];

    /** Role constraints */
    roleConstraints?: string[];
  };

  /** Revocation logic */
  revocation: {
    /** Whether the rule is active */
    isActive: boolean;

    /** When the rule was created */
    createdAt: Date;

    /** When the rule was revoked */
    revokedAt?: Date;

    /** Reason for revocation */
    reason?: string;
  };

  /** When the access rule was created */
  createdAt: Date;

  /** When the access rule was last updated */
  updatedAt: Date;
}