import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import sharp from 'sharp'

export class FileUploadService {
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
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!
  }

  async uploadMedicalRecord(
    file: Buffer,
    originalName: string,
    patientId: string,
    metadata: Record<string, string> = {}
  ): Promise<{ key: string; url: string; size: number }> {
    try {
      // Generate unique file key
      const timestamp = Date.now()
      const hash = crypto.createHash('md5').update(file).digest('hex')
      const extension = originalName.split('.').pop()
      const key = `medical-records/${patientId}/${timestamp}-${hash}.${extension}`

      // Validate file type (only allow specific types for medical records)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]

      // Get MIME type from buffer (in production, use file-type library)
      const mimeType = this.detectMimeType(file, extension!)
      
      if (!allowedTypes.includes(mimeType)) {
        throw new Error('Invalid file type for medical records')
      }

      // Compress images if needed
      let processedFile = file
      if (mimeType.startsWith('image/')) {
        processedFile = await sharp(file)
          .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer()
      }

      // Upload to S3 with metadata
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: processedFile,
          ContentType: mimeType,
          Metadata: {
            patientId,
            originalName,
            uploadedAt: new Date().toISOString(),
            ...metadata,
          },
          // Enable server-side encryption for HIPAA compliance
          ServerSideEncryption: 'AES256',
        })
      )

      // Generate signed URL for immediate access (expires in 1 hour)
      const signedUrl = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
        { expiresIn: 3600 }
      )

      return {
        key,
        url: signedUrl,
        size: processedFile.length,
      }
    } catch (error) {
      console.error('File upload failed:', error)
      throw new Error('Failed to upload file')
    }
  }

  async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      return await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
        { expiresIn }
      )
    } catch (error) {
      console.error('Failed to generate presigned URL:', error)
      throw error
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      )
    } catch (error) {
      console.error('File deletion failed:', error)
      throw error
    }
  }

  private detectMimeType(buffer: Buffer, extension: string): string {
    // Simple MIME type detection (use 'file-type' library in production)
    const signatures: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }

    return signatures[extension.toLowerCase()] || 'application/octet-stream'
  }
}