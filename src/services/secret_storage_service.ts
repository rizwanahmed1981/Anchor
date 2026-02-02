/**
 * Secret Storage Service
 *
 * Implements secure secret storage functionality with client-side encryption.
 */

import { Secret, SecretMetadata } from '../models/secret';
import { CryptoService } from './crypto_service';
import { LoggingService } from './logging_service';

export class SecretStorageService {
  private cryptoService: CryptoService;
  private loggingService: LoggingService;

  constructor(cryptoService: CryptoService, loggingService?: LoggingService) {
    this.cryptoService = cryptoService;
    this.loggingService = loggingService || new LoggingService();
  }

  /**
   * Store a secret with client-side encryption
   */
  public async storeSecret(secretData: string, metadata: SecretMetadata, key: CryptoKey, userId?: string): Promise<Secret> {
    try {
      // Encrypt the secret data using the provided key
      const encryptedData = await this.cryptoService.encrypt(secretData, key);

      // Create a new secret object
      const secret: Secret = {
        id: this.generateId(),
        encryptedData,
        metadata,
        isEncrypted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Log the storage operation
      if (userId) {
        this.loggingService.logSecretStored(secret.id, userId);
      }

      // Here we would persist the secret to storage
      // For now, we'll just return the secret object
      // In a real implementation, this would save to IndexedDB, localStorage, or a server

      return secret;
    } catch (error) {
      // Log the error
      this.loggingService.logError(error as Error, 'storeSecret', userId);
      throw error;
    }
  }

  /**
   * Save a secret to persistent storage
   */
  public async saveSecret(secret: Secret, userId?: string): Promise<void> {
    try {
      // In a real implementation, this would save to persistent storage
      // For example, using IndexedDB or sending to a server with only encrypted data
      console.log(`Saving secret ${secret.id} to storage`);

      // Update the timestamp
      secret.updatedAt = new Date();

      // Log the save operation
      if (userId) {
        this.loggingService.logSecretUpdated(secret.id, userId);
      }
    } catch (error) {
      // Log the error
      this.loggingService.logError(error as Error, 'saveSecret', userId);
      throw error;
    }
  }

  /**
   * Generate a unique ID for a secret
   */
  private generateId(): string {
    // Generate a random UUID-like string
    return 'ss_' + Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate secret data before storing
   */
  public validateSecret(secret: Secret, userId?: string): boolean {
    try {
      // Check that required fields are present
      if (!secret.id || !secret.encryptedData || !secret.metadata) {
        if (userId) {
          this.loggingService.logSecurityEvent('VALIDATION_FAILED', userId, {
            resourceId: secret.id,
            reason: 'Missing required fields'
          });
        }
        return false;
      }

      // Check that the encrypted data is properly formatted
      if (typeof secret.encryptedData !== 'string' || secret.encryptedData.length === 0) {
        if (userId) {
          this.loggingService.logSecurityEvent('VALIDATION_FAILED', userId, {
            resourceId: secret.id,
            reason: 'Invalid encrypted data format'
          });
        }
        return false;
      }

      // Check that metadata has required fields
      if (!secret.metadata.type || !secret.metadata.context || !secret.metadata.ownership) {
        if (userId) {
          this.loggingService.logSecurityEvent('VALIDATION_FAILED', userId, {
            resourceId: secret.id,
            reason: 'Missing required metadata fields'
          });
        }
        return false;
      }

      // Check that ownership has required fields
      if (!secret.metadata.ownership.ownerId || !secret.metadata.ownership.ownerName) {
        if (userId) {
          this.loggingService.logSecurityEvent('VALIDATION_FAILED', userId, {
            resourceId: secret.id,
            reason: 'Missing required ownership fields'
          });
        }
        return false;
      }

      return true;
    } catch (error) {
      // Log the error
      this.loggingService.logError(error as Error, 'validateSecret', userId);
      return false;
    }
  }

  /**
   * Batch store multiple secrets
   */
  public async batchStoreSecrets(secrets: Array<{data: string, metadata: SecretMetadata}>, key: CryptoKey, userId?: string): Promise<Secret[]> {
    const storedSecrets: Secret[] = [];

    for (const secret of secrets) {
      try {
        const stored = await this.storeSecret(secret.data, secret.metadata, key, userId);
        storedSecrets.push(stored);
      } catch (error) {
        // Log the error but continue with other secrets
        this.loggingService.logError(error as Error, 'batchStoreSecrets', userId);
        // Depending on requirements, we might want to throw here instead
        // For now, we'll continue processing other secrets
      }
    }

    return storedSecrets;
  }
}