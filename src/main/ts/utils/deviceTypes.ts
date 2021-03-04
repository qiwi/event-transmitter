import {isMobile as _isMobile} from 'is-mobile'

export const isMobile = (userAgent: string): boolean => _isMobile({ua: userAgent, tablet: true})
