export interface EventBusAdapter {
  publish(type: string, data: unknown, meta?: Record<string, any>): Promise<void>;
  subscribe?(type: string, handler: (data: any, meta?: any) => void): Promise<() => void>;
}

/**
 * Singleton EventBus to be imported by UI components.
 * The same instance can both publish and subscribe,
 * abstracting the transport mechanism (Kafka REST, NATS WS, Mock, ...)
 */
export class EventBus {
  constructor(private adapter: EventBusAdapter) {}

  async emit<T>(type: string, data: T) {
    const jwt = localStorage.getItem("demo.jwt") || "";
    await this.adapter.publish(type, data, { jwt });
  }

  /**
   * Optional subscription utility. Returns an async disposer.
   */
  async on(type: string, handler: (data: any, meta?: any) => void) {
    if (!this.adapter.subscribe) {
      throw new Error("Subscribe not implemented by adapter");
    }
    return this.adapter.subscribe(type, handler);
  }
}
