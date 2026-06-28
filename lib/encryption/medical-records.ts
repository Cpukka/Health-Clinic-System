// /lib/encryption/medical-records.ts
import crypto from 'crypto'

// Type for GCM cipher
type CipherGCM = crypto.CipherGCM

export class MedicalRecordEncryption {
  private algorithm = 'aes-256-gcm'
  private key: Buffer

  constructor() {
    // In production, use KMS or HashiCorp Vault
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable is required')
    }
    this.key = crypto.scryptSync(
      process.env.ENCRYPTION_KEY,
      'salt',
      32
    )
  }

  encrypt(plaintext: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16)
    
    // Create GCM cipher and cast to CipherGCM type
    const cipher = crypto.createCipheriv(
      this.algorithm, 
      this.key, 
      iv
    ) as crypto.CipherGCM
    
    // Encrypt the data
    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    // Get the auth tag for GCM (now TypeScript knows it exists)
    const tag = cipher.getAuthTag()
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    }
  }

  decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    ) as crypto.DecipherGCM
    
    // Set the auth tag for verification
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // Convenience method for encrypting objects
  encryptObject<T extends Record<string, any>>(obj: T): {
    data: string
    iv: string
    tag: string
  } {
    const jsonString = JSON.stringify(obj)
    return this.encrypt(jsonString)
  }

  decryptObject<T extends Record<string, any>>(
    encrypted: string,
    iv: string,
    tag: string
  ): T {
    const jsonString = this.decrypt(encrypted, iv, tag)
    return JSON.parse(jsonString)
  }

  // For sensitive fields like diagnosis, prescriptions
  static encryptSensitiveFields(data: Record<string, any>): Record<string, any> {
    const encryptor = new MedicalRecordEncryption()
    const encrypted: Record<string, any> = {}
    
    // Copy non-sensitive fields
    for (const [key, value] of Object.entries(data)) {
      if (MedicalRecordEncryption.isSensitiveField(key) && value) {
        // Encrypt sensitive fields
        const result = encryptor.encrypt(String(value))
        encrypted[key] = {
          encrypted: result.encrypted,
          iv: result.iv,
          tag: result.tag,
        }
      } else {
        encrypted[key] = value
      }
    }
    
    return encrypted
  }

  static decryptSensitiveFields(data: Record<string, any>): Record<string, any> {
    const decryptor = new MedicalRecordEncryption()
    const decrypted: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(data)) {
      if (this.isSensitiveField(key) && value?.encrypted) {
        try {
          // Decrypt sensitive fields
          decrypted[key] = decryptor.decrypt(
            value.encrypted,
            value.iv,
            value.tag
          )
        } catch (error) {
          console.error(`Failed to decrypt field ${key}:`, error)
          decrypted[key] = null
        }
      } else {
        decrypted[key] = value
      }
    }
    
    return decrypted
  }

  static isSensitiveField(field: string): boolean {
    const sensitiveFields = [
      'diagnosis',
      'prescription',
      'notes',
      'testResults',
      'treatmentPlan',
      'medicalHistory',
      'allergies',
      'medications',
      'symptoms',
      'chiefComplaint',
    ]
    return sensitiveFields.includes(field)
  }
}