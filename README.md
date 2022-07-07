# @qiwi/event-transmitter
> Async adapter to save &amp; deliver reasonable events to some endpoint  

[![CI](https://github.com/qiwi/event-transmitter/workflows/CI/badge.svg)](https://github.com/qiwi/event-transmitter/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/d72d92ed2e931dacecf9/maintainability)](https://codeclimate.com/github/qiwi/event-transmitter/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d72d92ed2e931dacecf9/test_coverage)](https://codeclimate.com/github/qiwi/event-transmitter/test_coverage)

## Install
```bash
yarn add @qiwi/event-transmitter
```

## Usage
```ts
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

### FLP integration
```ts
import { createFrontLogProxyTransmitter } from '@qiwi/event-transmitter'

const transmitter = createFrontLogProxyTransmitter({
  appName: 'my-app',
  url: 'https://example.qiwi.com/event'
})

// logger-like interface
transmitter.error(new Error('some error'))
transmitter.info('some-event')
transmitter.debug('debug')
transmitter.warn('warn')
transmitter.trace('trace')
```
See also [https://github.com/qiwi/flp-njs](https://github.com/qiwi/flp-njs)

## License
[MIT](LICENSE)
