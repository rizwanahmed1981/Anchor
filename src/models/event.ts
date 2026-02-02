/**
 * Event Model
 *
 * An immutable record of system activity used for auditing, timelines, and risk evaluation.
 */

export interface Event {
  /** Unique identifier for the event */
  id: string;

  /** Type of event */
  eventType: 'secret_created' | 'secret_accessed' | 'access_granted' | 'access_revoked' | 'risk_detected' | 'recovery_initiated' | 'device_registered' | 'identity_verified';

  /** Timestamp of the event */
  timestamp: Date;

  /** User or identity associated with the event */
  userId?: string;

  /** Related secret identifier */
  secretId?: string;

  /** Related device identifier */
  deviceId?: string;

  /** Event details */
  details: {
    /** Description of the event */
    description: string;

    /** Additional metadata */
    metadata?: Record<string, any>;
  };

  /** Immutable signature */
  signature: string;

  /** Event source */
  source: 'client' | 'server';

  /** When the event was recorded */
  recordedAt: Date;
}