import  Speakeasy  from 'speakeasy'
import  prisma  from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  const secret = Speakeasy.generateSecret({
    name: `HealthClinic:${user?.email}`,
  })

  await prisma.user.update({
    where: { id: user?.id },
    data: { twoFactorSecret: secret.base32 },
  })

  return Response.json({ secret: secret.base32, qrCode: secret.otpauth_url })
}