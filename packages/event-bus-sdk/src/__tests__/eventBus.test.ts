import { EventBus } from '../index';
import { MockAdapter } from '../mockAdapter';

test('emit and on using mock adapter', async () => {
  const bus = new EventBus(new MockAdapter());
  let received = '';
  await bus.on('Ping', (d)=>{ received = d.msg; });
  await bus.emit('Ping', { msg: 'hello' });
  expect(received).toBe('hello');
});
