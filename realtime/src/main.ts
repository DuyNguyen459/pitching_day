import { Server } from 'socket.io';
import { createServer } from 'http';
import Redis from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function bootstrap() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Setup Redis adapter for Socket.io scaling
  try {
    const pubClient = new Redis(REDIS_URL);
    const subClient = pubClient.duplicate();

    io.adapter(createAdapter(pubClient, subClient));
    console.log('Successfully connected Socket.io to Redis Adapter.');
  } catch (err) {
    console.error('Failed to configure Redis Adapter for Socket.io:', err);
  }

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Emit mock pitch score evaluations periodically for UI demo/validation
  let count = 0;
  setInterval(() => {
    count++;
    const mockPitchId = `pitch-id-${1000 + count}`;
    const mockScore = Math.floor(Math.random() * 41) + 60; // Random score between 60 and 100

    io.emit('vote-updates', {
      pitchId: mockPitchId,
      score: mockScore,
    });
    console.log(`Emitted mock vote: ${mockPitchId} -> ${mockScore} pts`);
  }, 5000);

  httpServer.listen(PORT, () => {
    console.log(`Realtime Socket.io server is running on: http://localhost:${PORT}`);
  });
}

bootstrap();
