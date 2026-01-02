import crypto from 'crypto'

export class MedicalRecordEncryption {
  private algorithm = 'aes-256-gcm'
  private key: Buffer

  constructor() {
    // In production, use KMS or HashiCorp Vault
    this.key = crypto.scryptSync(
      process.env.ENCRYPTION_KEY!,
      'salt',
      32
    )
  }

  encrypt(plaintext: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
    
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
    )
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  // For sensitive fields like diagnosis, prescriptions
  static encryptSensitiveData(data: Record<string, any>): Record<string, any> {
    const encryptor = new MedicalRecordEncryption()
    const encrypted: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (this.isSensitiveField(key)) {
        const result = encryptor.encrypt(String(value))
        encrypted[key] = result
      } else {
        encrypted[key] = value
      }
    }

    return encrypted
  }

  private static isSensitiveField(field: string): boolean {
    const sensitiveFields = [
      'diagnosis',
      'prescription',
      'notes',
      'testResults',
      'treatmentPlan',
    ]
    return sensitiveFields.includes(field)
  }
}