import type { EventBusAdapter } from './index';

export class KafkaAdapter implements EventBusAdapter {
  constructor(private endpoint: string) {}
  async publish(type: string, data: unknown, meta?: any) {
    const body = { type, data, meta };
    await fetch(this.endpoint + "/events", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(meta?.jwt && { Authorization: `Bearer ${meta.jwt}` })
      },
      body: JSON.stringify(body)
    });
  }
}
