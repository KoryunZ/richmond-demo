// Small inline icons for the header, the floating button and the footer.
const Svg = ({ children, size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
export const Insta = (p) => <Svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></Svg>
export const Phone = (p) => <Svg {...p}><path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A13 13 0 0 1 4 7a2 2 0 0 1 1-3z" /></Svg>
export const Telegram = (p) => <Svg {...p}><path d="M21 4 3 11.2l5.4 2 2 6 3-3.7 4.8 3.6z" /><path d="m8.4 13.2 12-8.6" /></Svg>
export const WhatsApp = (p) => <Svg {...p}><path d="M4 20l1.2-4.1A8.4 8.4 0 1 1 8.2 19z" /><path d="M9.2 8.8c.2 2.6 2.6 5 5.4 5.6l1.1-1.3-2-1-.9.7a5 5 0 0 1-2-2l.7-.9-1-2z" /></Svg>
export const Chevron = (p) => <Svg {...p} size={14}><path d="m6 9 6 6 6-6" /></Svg>
export const Burger = ({ open }) => <Svg>{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</Svg>
