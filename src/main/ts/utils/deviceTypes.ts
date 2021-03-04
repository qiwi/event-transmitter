import { isMobile as _isMobile } from 'is-mobile'

// + handle 'armv7l'
// Mozilla/5.0 (X11; ; U; Linux armv7l; en-gb) AppleWebKit/534.26+ (KHTML, like Gecko) Version/5.0 Safari/534.26+

export const isMobile = (userAgent: string): boolean =>
  /armv7l/i.test(userAgent) || _isMobile({ ua: userAgent, tablet: true })
