/**
 * Validation Service
 *
 * Provides validation and error handling for secret operations.
 */

import { Secret } from '../models/secret';
import { ErrorHandlingService } from './error_handler';

export class ValidationService {
  private errorService: ErrorHandlingService;

  constructor() {
    this.errorService = new ErrorHandlingService();
  }

  /**
   * Validate a secret before storage
   */
  public validateSecretForStorage(secret: Secret): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate ID
    if (!secret.id || typeof secret.id !== 'string' || secret.id.trim() === '') {
      errors.push('Secret ID is required and must be a non-empty string');
    }

    // Validate encrypted data
    if (!secret.encryptedData || typeof secret.encryptedData !== 'string' || secret.encryptedData.trim() === '') {
      errors.push('Encrypted data is required and must be a non-empty string');
    }

    // Validate metadata
    if (!secret.metadata) {
      errors.push('Metadata is required');
    } else {
      // Validate metadata type
      if (!secret.metadata.type || typeof secret.metadata.type !== 'string' || secret.metadata.type.trim() === '') {
        errors.push('Secret type is required in metadata');
      }

      // Validate context
      if (!secret.metadata.context || typeof secret.metadata.context !== 'string' || secret.metadata.context.trim() === '') {
        errors.push('Secret context is required in metadata');
      }

      // Validate ownership
      if (!secret.metadata.ownership) {
        errors.push('Ownership information is required in metadata');
      } else {
        if (!secret.metadata.ownership.ownerId || typeof secret.metadata.ownership.ownerId !== 'string') {
          errors.push('Owner ID is required in ownership information');
        }

        if (!secret.metadata.ownership.ownerName || typeof secret.metadata.ownership.ownerName !== 'string') {
          errors.push('Owner name is required in ownership information');
        }
      }

      // Validate audit history
      if (!secret.metadata.auditHistory) {
        errors.push('Audit history is required in metadata');
      } else {
        if (!secret.metadata.auditHistory.createdAt) {
          errors.push('Creation timestamp is required in audit history');
        }

        if (!secret.metadata.auditHistory.updatedAt) {
          errors.push('Update timestamp is required in audit history');
        }
      }
    }

    // Validate encryption status
    if (typeof secret.isEncrypted !== 'boolean') {
      errors.push('Encryption status (isEncrypted) must be a boolean');
    }

    // Validate timestamps
    if (!secret.createdAt) {
      errors.push('Creation timestamp is required');
    }

    if (!secret.updatedAt) {
      errors.push('Update timestamp is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate secret data before encryption
   */
  public validateSecretData(data: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (typeof data !== 'string') {
      errors.push('Secret data must be a string');
    } else if (data.length === 0) {
      errors.push('Secret data cannot be empty');
    } else if (data.length > 1024 * 1024) { // 1MB limit
      errors.push('Secret data exceeds maximum size limit of 1MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate metadata for a new secret
   */
  public validateSecretMetadata(metadata: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!metadata) {
      errors.push('Metadata is required');
      return {
        isValid: false,
        errors
      };
    }

    // Validate type
    if (!metadata.type || typeof metadata.type !== 'string') {
      errors.push('Secret type is required and must be a string');
    } else {
      const validTypes = ['password', 'passkey', 'api_key', 'ssh_key', 'oauth_token', 'secure_note'];
      if (!validTypes.includes(metadata.type.toLowerCase())) {
        errors.push(`Secret type must be one of: ${validTypes.join(', ')}`);
      }
    }

    // Validate context
    if (!metadata.context || typeof metadata.context !== 'string' || metadata.context.trim() === '') {
      errors.push('Secret context is required and must be a non-empty string');
    }

    // Validate ownership (if provided)
    if (metadata.ownership) {
      if (!metadata.ownership.ownerId || typeof metadata.ownership.ownerId !== 'string') {
        errors.push('Owner ID is required in ownership information');
      }

      if (!metadata.ownership.ownerName || typeof metadata.ownership.ownerName !== 'string') {
        errors.push('Owner name is required in ownership information');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate access rights for a secret
   */
  public validateAccessRights(secret: Secret, userId: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if the user owns the secret
    if (secret.metadata.ownership.ownerId !== userId) {
      // In a complete implementation, we would check shared access rules here
      errors.push('User does not have access rights to this secret');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize secret data for display
   */
  public sanitizeSecretForDisplay(secret: Secret): Partial<Secret> {
    // Return a sanitized version of the secret that doesn't expose sensitive data
    return {
      id: secret.id,
      metadata: secret.metadata,
      isEncrypted: secret.isEncrypted,
      createdAt: secret.createdAt,
      updatedAt: secret.updatedAt
    };
  }
}