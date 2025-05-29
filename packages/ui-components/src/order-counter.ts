import { html, css, customElement, state } from 'lit';
import { EventedElement } from './evented-element';

@customElement('order-counter')
export class OrderCounter extends EventedElement {
  static styles = css\`
    :host { font-family: sans-serif; display:block; }
  \`;

  @state() total = 0;

  connectedCallback() {
    super.connectedCallback();
    this.on('OrderCreated', () => {
      this.total++;
    });
  }

  render() {
    return html\`<p>Total orders: <strong>\${this.total}</strong></p>\`;
  }
}
