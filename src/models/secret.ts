/**
 * Secret Model
 *
 * Represents a protected unit of sensitive data with type, context, ownership,
 * access rules, risk metadata, and audit history.
 */

export interface SecretMetadata {
  /** Type of secret (password, passkey, API key, etc.) */
  type: string;

  /** Usage context (e.g., "work email", "personal banking") */
  context: string;

  /** Ownership information */
  ownership: {
    /** Owner identifier */
    ownerId: string;

    /** Primary owner name */
    ownerName: string;
  };

  /** Access rules that govern who can access this secret */
  accessRules?: string[];

  /** Risk metadata */
  riskMetadata?: {
    /** Last time risk was evaluated */
    lastEvaluated: Date;

    /** Risk score (0-100) */
    riskScore: number;

    /** Risk categories */
    riskCategories: string[];
  };

  /** Audit history */
  auditHistory: {
    /** When the secret was created */
    createdAt: Date;

    /** When the secret was last modified */
    updatedAt: Date;

    /** When the secret was last accessed */
    lastAccessed?: Date;

    /** Who last accessed the secret */
    lastAccessor?: string;
  };
}

export interface Secret {
  /** Unique identifier for the secret */
  id: string;

  /** Encrypted secret data */
  encryptedData: string;

  /** Metadata about the secret */
  metadata: SecretMetadata;

  /** Encrypted with client-side key */
  isEncrypted: boolean;

  /** When the secret was created */
  createdAt: Date;

  /** When the secret was last updated */
  updatedAt: Date;
}