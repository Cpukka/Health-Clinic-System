import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'
import { NextApiResponse } from 'next'

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export class RealtimeService {
  private io: SocketIOServer

  constructor(server: NetServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Join clinic room
      socket.on('join-clinic', (clinicId: string) => {
        socket.join(`clinic-${clinicId}`)
      })

      // Join doctor room
      socket.on('join-doctor', (doctorId: string) => {
        socket.join(`doctor-${doctorId}`)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }

  emitAppointmentUpdate(appointmentId: string, data: any) {
    this.io.emit(`appointment-${appointmentId}`, data)
  }

  notifyClinic(clinicId: string, event: string, data: any) {
    this.io.to(`clinic-${clinicId}`).emit(event, data)
  }
}