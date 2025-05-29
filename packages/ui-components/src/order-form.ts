import { LitElement, html, css, customElement, state } from 'lit';
import { EventBus, KafkaAdapter } from '@my-org/event-bus-sdk';

const eventBus = new EventBus(new KafkaAdapter('/api'));

@customElement('order-form')
export class OrderForm extends LitElement {
  static styles = css\`
    :host { font-family: sans-serif; }
    form { display: flex; gap: 0.5rem; }
  \`;

  @state() qty = 1;

  private submitHandler(e: Event) {
    e.preventDefault();
    const payload = {
      orderId: crypto.randomUUID(),
      items: [{ sku: 'ABC', qty: this.qty }],
      ts: Date.now()
    };
    eventBus.emit('OrderCreated', payload);
    this.qty = 1;
  }

  render() {
    return html\`
      <form @submit=\${this.submitHandler}>
        <input type="number" .value=\${this.qty} @input=\${(e:any)=>this.qty=e.target.value} min="1" />
        <button>Send Order</button>
      </form>
    \`;
  }
}
