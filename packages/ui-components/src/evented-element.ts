import { LitElement } from 'lit';
import { EventBus, KafkaAdapter, NatsAdapter, MockAdapter } from '@my-org/event-bus-sdk';

declare global {
  interface Window { __EVENT_BUS__: 'kafka' | 'nats' | 'mock'; }
}

let adapter;
switch (window.__EVENT_BUS__ || 'kafka') {
  case 'nats': adapter = new NatsAdapter('/nats'); break;
  case 'mock': adapter = new MockAdapter(); break;
  default: adapter = new KafkaAdapter('/api');
}

export const eventBus = new EventBus(adapter);

/**
 * Base class for all framework components.
 */
export class EventedElement<TPayload = any> extends LitElement {
  protected emit(type: string, payload: TPayload) {
    eventBus.emit(type, payload);
  }

  protected on(type: string, handler: (data: any, meta?: any) => void) {
    return eventBus.on(type, handler);
  }
}
