/**
 * Anchor Password Manager - Main Entry Point
 *
 * This is the entry point for the Anchor password manager application.
 * It initializes the core components and sets up the application structure.
 */

// Import core modules
import { SecretManager } from './services/secret_manager';
import { IdentityManager } from './services/identity_manager';

/**
 * Main application class
 */
export class AnchorApp {
  private secretManager: SecretManager;
  private identityManager: IdentityManager;

  constructor() {
    this.secretManager = new SecretManager();
    this.identityManager = new IdentityManager();
  }

  /**
   * Initialize the application
   */
  public async initialize(): Promise<void> {
    console.log('Initializing Anchor Password Manager...');

    // Initialize core services
    await this.secretManager.initialize();
    await this.identityManager.initialize();

    console.log('Anchor Password Manager initialized successfully');
  }

  /**
   * Get the secret manager instance
   */
  public getSecretManager(): SecretManager {
    return this.secretManager;
  }

  /**
   * Get the identity manager instance
   */
  public getIdentityManager(): IdentityManager {
    return this.identityManager;
  }
}

// Export default instance
export default new AnchorApp();