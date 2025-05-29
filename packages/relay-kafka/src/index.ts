import express from 'express';
import { Kafka } from 'kafkajs';
import cors from 'cors';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const kafka = new Kafka({ brokers });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'relay-sse' });

(async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'web-events', fromBeginning: false });

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post('/events', async (req, res) => {
    const { type, data, meta } = req.body;
    await producer.send({
      topic: 'web-events',
      messages: [{ key: type, value: JSON.stringify({ type, data, meta }) }]
    });
    res.sendStatus(202);
  });

  // Map of connected clients
  const clients = new Map<string, express.Response>();

  app.get('/stream', (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.flushHeaders();
    const id = Math.random().toString(36).slice(2);
    clients[id] = res;
    req.on('close', () => { clients.delete(id); });
  });

  // fan-out loop
  consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value!.toString());
      const streamLine = `data: ${JSON.stringify(payload)}

`;
      for (const res of clients.values()) {
        res.write(streamLine);
      }
    }
  });

  app.listen(8080, () => console.log('Relay listening on 8080 (+SSE)'));
})();
