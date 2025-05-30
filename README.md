# Event‑Driven Framework Demo

Questa repo dimostra come:

1. **`event-bus-sdk`** – SDK agnostico (Kafka + NATS adapter)
2. **`ui-components`** – Web Component `order-form`
3. **`relay-kafka`** – Micro‑relay Express → Kafka
4. **`order-processor`** – Consumer Kafka

## Prerequisiti
* Node ≥ 18, npm ≥ 9  
* Docker + Docker Compose

## Avvio rapido

```bash
# installa dipendenze (monorepo)
npm install

# build TypeScript
npm run build

# avvia tutti i container (Kafka + servizi)
docker compose up --build
```

Poi apri `http://localhost:8080` in un browser: la pagina demo invia un evento
`OrderCreated`, consumato da `order-processor` (log in console).
