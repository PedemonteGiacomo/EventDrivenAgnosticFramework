export interface EventBusAdapter {
  publish(type: string, data: unknown, meta?: Record<string, any>): Promise<void>;
}

export class EventBus {
  constructor(private adapter: EventBusAdapter) {}

  async emit<T>(type: string, data: T) {
    const jwt = localStorage.getItem("demo.jwt") || "";
    await this.adapter.publish(type, data, { jwt });
  }
}
