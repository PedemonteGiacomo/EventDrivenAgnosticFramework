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

  /**
   * Simple implementation via Server-Sent Events provided by relay
   */
  async subscribe(type: string, handler: (data: any, meta?: any) => void) {
    const ev = new EventSource(this.endpoint + "/stream?type=" + encodeURIComponent(type));
    const listener = (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      handler(payload.data, payload.meta);
    };
    ev.addEventListener("message", listener);
    return async () => {
      ev.removeEventListener("message", listener);
      ev.close();
    };
  }
}
