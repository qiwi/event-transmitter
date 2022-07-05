export const getCookie = (name: string, cookieString = document.cookie) => {
  const item = cookieString
    .split(';')
    .map((entry) => entry.split('='))
    .find(([key]) => name === key.trimStart())
  return (item || [])[1]
}
export const setCookie = (
  name: string,
  value: string,
  documentInstance = document,
) => {
  documentInstance.cookie = `${name}=${value}`
}
