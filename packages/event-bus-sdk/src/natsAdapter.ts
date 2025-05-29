import { connect, StringCodec } from "nats.ws";
import type { EventBusAdapter } from './index';

export class NatsAdapter implements EventBusAdapter {
  private sc = StringCodec();
  private promise: Promise<any>;
  constructor(private url: string, private token?: string) {
    this.promise = connect({ servers: url, token });
  }
  async publish(type: string, data: unknown, meta?: any) {
    const nc = await this.promise;
    const js = nc.jetstream();
    await js.publish("WEB.EVENTS", this.sc.encode(JSON.stringify({ type, data, meta })));
  }
}
