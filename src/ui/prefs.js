// Currency: prices are kept in US dollars (the demo's price list) and shown in the visitor's currency.
export const CURRENCIES = ['USD', 'AED', 'EUR']
export const RATES = { USD: 1, AED: 3.6725, EUR: 0.92 } // AED is pegged to the dollar; the euro rate is an approximate demo value
const SYM = { USD: '$', EUR: '€', AED: 'AED ' }
export const fmt = (usd, cur) => `${SYM[cur]}${Math.round(usd * RATES[cur]).toLocaleString('en-US')}`
