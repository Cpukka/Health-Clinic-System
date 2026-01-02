import  prisma  from '@/lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { schedule } from 'node-cron'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'

export class BackupService {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    this.bucketName = process.env.BACKUP_BUCKET_NAME!
    
    // Schedule daily backups at 2 AM
    schedule('0 2 * * *', () => this.createBackup())
  }

  async createBackup(): Promise<void> {
    try {
      console.log('Starting database backup...')
      
      // Export all critical tables
      const backupData = {
        timestamp: new Date().toISOString(),
        patients: await prisma.patient.findMany({
          include: {
            medicalRecords: true,
            appointments: true,
          },
        }),
        appointments: await prisma.appointment.findMany(),
        medicalRecords: await prisma.medicalRecord.findMany(),
        users: await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        }),
      }

      // Compress backup
      const jsonString = JSON.stringify(backupData)
      const compressed = await this.compressData(jsonString)

      // Upload to S3
      const backupKey = `backups/${new Date().toISOString().split('T')[0]}/backup_${Date.now()}.json.gz`
      
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: backupKey,
          Body: compressed,
          ContentType: 'application/json',
          ContentEncoding: 'gzip',
          StorageClass: 'GLACIER_IR', // Infrequent access for backups
        })
      )

      console.log(`Backup completed: ${backupKey}`)

      // Clean old backups (keep last 30 days)
      await this.cleanOldBackups()
    } catch (error) {
      console.error('Backup failed:', error)
      // Send alert to admin
      await this.sendBackupFailureAlert(error)
    }
  }

  private async compressData(data: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      const gzip = createGzip()
      
      gzip.on('data', (chunk) => chunks.push(chunk))
      gzip.on('end', () => resolve(Buffer.concat(chunks)))
      gzip.on('error', reject)
      
      gzip.write(data)
      gzip.end()
    })
  }

  private async cleanOldBackups(): Promise<void> {
    // Implement logic to delete backups older than 30 days
    // This would require listing objects in S3 and deleting old ones
  }

  private async sendBackupFailureAlert(error: any): Promise<void> {
    // Send alert via email, Slack, etc.
    console.error('Backup alert:', error)
  }
}