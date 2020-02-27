
// // import { IHttpRequestProvider } from '@qiwi/substrate'
// //
// // export interface IEventTransmitterPipe {}
// //
// export function createTransmitter ({ pipline }: {pipeline: Array<Function>}) {
//   pipline.reduce((acc, fn) => {})
// }
//
// export function createFetchPusher (
//   { url, batchUrl }: {
//     url: string,
//     batchUrl: string,
//   }) {
//   return function (eventDto) {
//     return fetch(Array.isArray(eventDto) ? batchUrl : url, { body: JSON.stringify(eventDto) })
//   }
// }
//
// const fetchPusher = createFetchPusher({
//   url: 'qiwilog',
//   batchUrl: 'qiwibatchlog'
// })
//
// export function createTransmitter ({ pipline }: {pipeline: Array<Function>}) {
//
// }
