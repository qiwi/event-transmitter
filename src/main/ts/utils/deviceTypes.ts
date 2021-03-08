import { isMobile as _isMobile } from 'is-mobile'

export const isMobile = (ua: string): ReturnType<typeof _isMobile> => _isMobile({ ua, tablet: true })
