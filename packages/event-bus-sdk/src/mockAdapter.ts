import type { EventBusAdapter } from './index';

export class MockAdapter implements EventBusAdapter {
  private handlers: Record<string, ((data:any,meta:any)=>void)[]> = {};
  async publish(type: string, data: unknown, meta?: any): Promise<void> {
    (this.handlers[type] || []).forEach(h => h(data, meta));
  }
  async subscribe(type: string, handler: (data:any,meta?:any)=>void) {
    if (!this.handlers[type]) this.handlers[type] = [];
    this.handlers[type].push(handler);
    return async () => {
      this.handlers[type] = this.handlers[type].filter(h => h !== handler);
    };
  }
}
