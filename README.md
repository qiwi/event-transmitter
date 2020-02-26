# event-transmitter
Async adapter to save &amp; deliver reasonable events to some endpoint

## Install
```bash
yarn add @qiwi/event-transmitter
```

## Usage
```typescript
import {createTransmitter, createFetchPusher, IEventTransmitterPipe} from '@qiwi/event-transmitter'

const pusher: IEventTransmitterPipe = createFetchPusher({
  url: 'https://example.qiwi.com/event',
  batchUrl: 'https://example.qiwi.com/event'
})
const transmitter = createTransmitter({
  pipeline: [pusher]
})
const event: IClientEventDto = {...}

transmitter.push(event)
```
