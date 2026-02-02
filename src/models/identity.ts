/**
 * Identity Model
 *
 * Represents a user or entity with associated trusted devices,
 * verified factors, recovery configuration, roles, and permissions.
 */

export interface TrustedDevice {
  /** Device identifier */
  deviceId: string;

  /** Hardware-backed key reference (where available) */
  hardwareKey?: string;

  /** Trust state (active, revoked) */
  trustState: 'active' | 'revoked';

  /** Last access timestamp */
  lastAccessed: Date;

  /** Explicit revocation support */
  revokedAt?: Date;

  /** Device name */
  deviceName?: string;
}

export interface RecoveryConfiguration {
  /** Recovery factors (email, SMS, authenticator, etc.) */
  factors: string[];

  /** Recovery method constraints */
  constraints: {
    /** Minimum number of factors required */
    minFactors: number;

    /** Maximum time delay for recovery */
    maxDelay?: number;

    /** Recovery quorum requirements */
    quorum?: number;
  };
}

export interface Identity {
  /** Unique identifier for the identity */
  id: string;

  /** User's name or identifier */
  name: string;

  /** Associated trusted devices */
  trustedDevices: TrustedDevice[];

  /** Verified factors */
  verifiedFactors: string[];

  /** Recovery configuration */
  recoveryConfig: RecoveryConfiguration;

  /** Roles and permissions */
  roles: string[];

  /** Permissions */
  permissions: string[];

  /** When the identity was created */
  createdAt: Date;

  /** When the identity was last updated */
  updatedAt: Date;
}