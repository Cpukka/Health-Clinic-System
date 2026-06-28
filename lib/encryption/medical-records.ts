// /lib/encryption/medical-records.ts
import crypto from 'crypto'

export class MedicalRecordEncryption {
  private algorithm = 'aes-256-gcm'
  private key: Buffer

  constructor() {
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
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv) as any
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
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
    ) as any
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // Fix: Return type should match what encrypt returns
  encryptObject<T extends Record<string, any>>(obj: T): {
    encrypted: string
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
    
    for (const [key, value] of Object.entries(data)) {
      if (MedicalRecordEncryption.isSensitiveField(key) && value) {
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
      if (MedicalRecordEncryption.isSensitiveField(key) && value?.encrypted) {
        try {
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