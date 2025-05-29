import express from 'express';
import { Kafka } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const kafka = new Kafka({ brokers });
const producer = kafka.producer();

(async () => {
  await producer.connect();
  const app = express();
  app.use(express.json());

  app.post('/events', async (req, res) => {
    const { type, data, meta } = req.body;
    await producer.send({
      topic: 'web-events',
      messages: [{ key: type, value: JSON.stringify({ type, data, meta }) }]
    });
    res.sendStatus(202);
  });

  app.listen(8080, () => console.log('Relay listening on 8080'));
})();
