import express, { Request, Response } from 'express';
import cors from 'cors';
import { Kafka } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const kafka = new Kafka({ brokers });

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'relay-sse' });

(async () => {
  //––– Kafka connections ----------------------------------------------------
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'web-events', fromBeginning: false });

  //––– HTTP & SSE server ----------------------------------------------------
  const app = express();
  app.use(cors());
  app.use(express.json());

  // POST /events  →  pubblica su Kafka
  app.post('/events', async (req: Request, res: Response) => {
    const { type, data, meta } = req.body;
    await producer.send({
      topic: 'web-events',
      messages: [{ key: type, value: JSON.stringify({ type, data, meta }) }]
    });
    res.sendStatus(202);
  });

  // Collezione di client SSE connessi
  const clients = new Map<string, Response>();

  // GET /stream  →  connessione Event-Stream
  app.get('/stream', (req: Request, res: Response) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.flushHeaders();

    const id = Math.random().toString(36).slice(2);
    clients.set(id, res);                       // <— uso Map.set

    req.on('close', () => {
      clients.delete(id);
    });
  });

  // Fan-out: ad ogni messaggio Kafka scrive su tutti i client SSE
  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value!.toString());
      const line = `data: ${JSON.stringify(payload)}\n\n`;
      for (const res of clients.values()) res.write(line);
    }
  });

  app.listen(8080, () => console.log('Relay listening on 8080 (+SSE)'));
})();
