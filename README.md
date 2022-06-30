# event-transmitter
Async adapter to save &amp; deliver reasonable events to some endpoint

## Install
```bash
yarn add @qiwi/event-transmitter
```

## Usage
```typescript
import { createFrontLogProxyTransmitter } from '@qiwi/event-transmitter'
const transmitter = createFrontLogProxyTransmitter('my-app', 'https://example.qiwi.com/event', )


```
```typescript
import {createTransmitter, createHttpPipe, IPipe} from '@qiwi/event-transmitter'

const httpPipe: IPipe = createFetchPusher({
  url: 'https://example.qiwi.com/event',
  method: 'POST'
})
const transmitter = createTransmitter({
  pipeline: [httpPipe]
})
const event: IClientEventDto = {...}

transmitter.push(event)
```
