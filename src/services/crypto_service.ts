/**
 * Cryptographic Service
 *
 * Implements client-side encryption and decryption services using Web Crypto API.
 */

export class CryptoService {
  private keyStore: Map<string, CryptoKey> = new Map();

  /**
   * Generate a key for encryption/decryption
   */
  public async generateKey(): Promise<CryptoKey> {
    // Generate a key using Web Crypto API
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    return key;
  }

  /**
   * Encrypt data with a key
   */
  public async encrypt(data: string, key: CryptoKey): Promise<string> {
    // Convert string to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  }

  /**
   * Decrypt data with a key
   */
  public async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    // Convert base64 to ArrayBuffer
    const binaryString = atob(encryptedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Separate IV and encrypted data
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  /**
   * Derive a key from a password
   */
  public async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    // Convert password to key material
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Derive key using PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return key;
  }

  /**
   * Store a key in the key store
   */
  public storeKey(keyId: string, key: CryptoKey): void {
    this.keyStore.set(keyId, key);
  }

  /**
   * Retrieve a key from the key store
   */
  public getKey(keyId: string): CryptoKey | undefined {
    return this.keyStore.get(keyId);
  }
}