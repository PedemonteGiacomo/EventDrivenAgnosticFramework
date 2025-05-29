import { Kafka } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const kafka = new Kafka({ brokers });
const consumer = kafka.consumer({ groupId: 'order-processor' });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'web-events', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value!.toString());
      if (payload.type === 'OrderCreated') {
        console.log('Order received:', payload.data);
      }
    }
  });
})();
