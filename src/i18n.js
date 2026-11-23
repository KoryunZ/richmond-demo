// All interface copy, in English and Russian. Facts about Richmond come from the company's own
// Instagram profile: no deposit, $400 – $10,000 a month, 24/7 support, WhatsApp and calls on +971 56 247 9977.
import { CHAPTERS, LENGTH, unit, carAt } from './film/timeline.js'
import { ADD, LANGS } from './i18n-add.js'
export { LANGS }

export const PHONE = '+971 56 247 9977'
export const PHONE_E164 = '971562479977'
export const INSTAGRAM = 'https://www.instagram.com/richmond_rentacar/'
export const TELEGRAM = `https://t.me/+${PHONE_E164}` // opens a chat by phone number; swap for the company's @handle if it has one

// When each chapter's title is on screen (timeline units 0–100). All of it is read from the footage, so swapping
// or re-cutting a clip moves the titles with it. A title comes up when the chapter's place has arrived and leaves
// when the place starts to change. It goes where the car is not: on the right when the car is on the left, up
// top when the car reaches into the left third; and it leaves early if the car drives into its corner.
const FADE = 9 // frames a title takes to come up or leave
const STEP = 3
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length
export const TITLES = CHAPTERS.map((c, i) => {
  const pts = []
  for (let x = c.enter; x <= c.exit; x += STEP) pts.push(carAt(x))
  const early = pts.slice(0, Math.max(1, Math.ceil(pts.length / 2)))
  const carX = mean(early.map((p) => p.x)), carW = mean(early.map((p) => p.w))
  // the closing title has the two buttons under it and always sits bottom left
  const side = !c.last && carX < 0.42 ? 'right' : 'left', high = !c.last && side === 'left' && carX - carW / 2 < 0.36
  let to = c.last ? LENGTH + FADE : c.exit
  if (!high && !c.last) {
    const j = pts.findIndex((p) => (side === 'left' ? p.x - p.w / 2 < 0.38 : p.x + p.w / 2 > 0.58))
    if (j > 2) to = Math.min(to, c.enter + j * STEP - 2)
  }
  return { id: c.id, last: c.last, rest: unit(c.rest), from: unit(c.enter), to: unit(to), fade: unit(FADE), tab: [unit(c.begin), unit(c.end)], side, high }
})

const BASE = {
  en: {
    brandSub: 'rent a car',
    nav: { fleet: 'Fleet', book: 'Booking', cta: 'Book on WhatsApp' },
    loader: 'Loading the film',
    scroll: 'Scroll to drive',
    skip: 'Skip to the fleet',
    tabs: { deposit: 'No deposit', recovery: '24/7 recovery', value: 'From $400', suv: 'SUV', luxury: 'Sport & luxury' },
    ch: {
      deposit: { a: 'No', b: 'deposit', p: 'Your journey starts without an upfront deposit.' },
      recovery: { a: '24/7', b: 'recovery', p: 'Help is always on the way.' },
      value: { a: 'From $400', b: 'a month', p: 'Find your perfect vehicle at an exceptional price.' },
      suv: { a: 'SUV', b: 'collection', p: 'Discover the freedom to go beyond the ordinary.' },
      luxury: { a: 'Sport &', b: 'luxury', p: 'Experience performance, elegance and comfort.' },
    },
    explore: 'Explore our fleet',
    bookNow: 'Book your vehicle',
    fleet: {
      h: 'Cars that everyone can afford', sub: 'From $400 to $10,000 a month, and no deposit on any of them.',
      note: 'Sample fleet and prices for this demo; the pictures are illustrations. Exact rates and availability on WhatsApp.',
      day: 'Per day', month: 'Per month', all: 'All', economy: 'Economy', suv: 'SUV', luxury: 'Luxury', sport: 'Sport',
      seats: 'seats', perDay: '/day', perMonth: '/month', book: 'Book', count: (n) => `${n} ${n === 1 ? 'car' : 'cars'}`,
      other: { h: 'Looking for another car?', p: 'Tell us the model and your dates.', cta: 'Ask on WhatsApp', msg: 'Hello Richmond! I am looking for a car that is not on the site: ' },
    },
    how: {
      h: 'Three steps to the keys',
      steps: [['Pick a car', 'Choose from the fleet, from a city runabout to a Urus.'], ['Message us', 'WhatsApp or a call. We answer 24 hours a day, 7 days a week.'], ['Sign and drive', 'Pay for the rental only. No deposit is held.']],
    },
    faq: {
      h: 'Before you book', sub: 'Something else?', ask: 'Ask on WhatsApp',
      items: [
        ['Is there really no deposit?', 'Yes. You pay for the rental itself and no deposit is held.'],
        ['How much does a month cost?', 'From $400 to $10,000 a month, depending on the car. The prices on this page are examples; message us for today\'s rate.'],
        ['What if the car breaks down?', 'Call or message us at any hour. Support works 24/7, and if the car cannot go on we send a recovery truck.'],
        ['What do I need to rent?', 'A passport, a visa page or Emirates ID, and a driving licence valid in the UAE. Send photos on WhatsApp and we confirm before you come.'],
        ['How do I book?', 'Pick a car and send the form below. It opens WhatsApp with your request already written. Or call us.'],
      ],
    },
    book: {
      h: 'Book your vehicle', sub: 'Fill this in and it opens WhatsApp with your request ready to send.',
      car: 'Car', any: 'Help me choose', from: 'Start date', period: 'Rental period', days: 'days', name: 'Your name', send: 'Send on WhatsApp', call: 'Or call',
      estimate: (o) => `About ${o.price} for ${o.days} ${o.days === 1 ? 'day' : 'days'}, no deposit. Sample price.`,
      msg: (o) => `Hello Richmond! I would like to rent ${o.car}${o.date ? ` from ${o.date}` : ''} for ${o.days} ${o.days === 1 ? 'day' : 'days'}.${o.name ? ` My name is ${o.name}.` : ''}`,
    },
    foot: {
      tagline: 'Cars that everyone can afford.', contact: 'Contact', site: 'On this page', whatsapp: 'WhatsApp', call: 'Call', how: 'How it works', faq: 'Questions',
      rights: 'Richmond Rent a Car, Dubai',
      demo: 'Concept site. The fleet pictures are AI-generated illustrations of the models, not photos of Richmond\'s cars; prices are placeholders; the answer about documents is an example to be replaced with Richmond\'s terms.',
      credits: 'The film is AI-generated video, made in Google Flow from pictures of the car. Onest typeface (SIL OFL).', insta: 'Instagram',
    },
    lang: 'RU',
  },
  ru: {
    brandSub: 'аренда авто',
    nav: { fleet: 'Автопарк', book: 'Бронирование', cta: 'Написать в WhatsApp' },
    loader: 'Загружаем фильм',
    scroll: 'Листайте, чтобы ехать',
    skip: 'Сразу к автопарку',
    tabs: { deposit: 'Без депозита', recovery: 'Эвакуация 24/7', value: 'От $400', suv: 'Внедорожники', luxury: 'Спорт и люкс' },
    ch: {
      deposit: { a: 'Без', b: 'депозита', p: 'Ваша поездка начинается без залога.' },
      recovery: { a: 'Эвакуация', b: '24/7', p: 'Помощь всегда в пути.' },
      value: { a: 'От $400', b: 'в месяц', p: 'Найдите свой идеальный автомобиль по отличной цене.' },
      suv: { a: 'Коллекция', b: 'внедорожников', p: 'Свобода ехать дальше привычного.' },
      luxury: { a: 'Спорт и', b: 'люкс', p: 'Мощность, элегантность и комфорт.' },
    },
    explore: 'Смотреть автопарк',
    bookNow: 'Забронировать авто',
    fleet: {
      h: 'Автомобили, доступные каждому', sub: 'От $400 до $10 000 в месяц, и ни на один не нужен депозит.',
      note: 'Автопарк и цены в этом демо условные, изображения — иллюстрации. Точные тарифы и наличие — в WhatsApp.',
      day: 'В день', month: 'В месяц', all: 'Все', economy: 'Эконом', suv: 'Внедорожники', luxury: 'Люкс', sport: 'Спорт',
      seats: 'мест', perDay: '/день', perMonth: '/мес', book: 'Выбрать', count: (n) => `${n} авто`,
      other: { h: 'Нужен другой автомобиль?', p: 'Напишите модель и даты.', cta: 'Спросить в WhatsApp', msg: 'Здравствуйте, Richmond! Ищу автомобиль, которого нет на сайте: ' },
    },
    how: {
      h: 'Три шага до ключей',
      steps: [['Выберите авто', 'От городского седана до Urus.'], ['Напишите нам', 'WhatsApp или звонок. Отвечаем круглосуточно, без выходных.'], ['Подпишите и поезжайте', 'Вы платите только за аренду. Депозит не блокируется.']],
    },
    faq: {
      h: 'Перед бронированием', sub: 'Остались вопросы?', ask: 'Спросите в WhatsApp',
      items: [
        ['Депозита правда нет?', 'Да. Вы платите только за аренду, депозит не блокируется.'],
        ['Сколько стоит месяц?', 'От $400 до $10 000 в месяц, в зависимости от автомобиля. Цены на этой странице условные; актуальный тариф подскажем в WhatsApp.'],
        ['Что делать, если машина сломалась?', 'Позвоните или напишите в любое время. Поддержка работает 24/7, и если машина не может ехать, мы пришлём эвакуатор.'],
        ['Что нужно для аренды?', 'Паспорт, виза или Emirates ID и водительское удостоверение, действующее в ОАЭ. Пришлите фото в WhatsApp, и мы всё подтвердим заранее.'],
        ['Как забронировать?', 'Выберите авто и отправьте форму ниже. Откроется WhatsApp с готовым сообщением. Или просто позвоните.'],
      ],
    },
    book: {
      h: 'Забронировать авто', sub: 'Заполните форму — откроется WhatsApp с готовым сообщением.',
      car: 'Автомобиль', any: 'Помогите выбрать', from: 'Дата начала', period: 'Срок аренды', days: 'дней', name: 'Ваше имя', send: 'Отправить в WhatsApp', call: 'Или позвоните',
      estimate: (o) => `Около ${o.price} за ${o.days} дн., без депозита. Цена условная.`,
      msg: (o) => `Здравствуйте, Richmond! Хочу арендовать ${o.car}${o.date ? ` с ${o.date}` : ''} на ${o.days} дн.${o.name ? ` Меня зовут ${o.name}.` : ''}`,
    },
    foot: {
      tagline: 'Автомобили, доступные каждому.', contact: 'Контакты', site: 'На странице', whatsapp: 'WhatsApp', call: 'Позвонить', how: 'Как это работает', faq: 'Вопросы',
      rights: 'Richmond Rent a Car, Дубай',
      demo: 'Концепт сайта. Изображения автопарка созданы ИИ и показывают модели, а не автомобили Richmond; цены условные; ответ про документы — пример, который нужно заменить условиями Richmond.',
      credits: 'Фильм: видео создано ИИ в Google Flow по фотографиям автомобиля. Шрифт Onest (SIL OFL).', insta: 'Instagram',
    },
    lang: 'EN',
  },
}

// Sample fleet for the demo (not Richmond's price list), cheapest first
const wk = (day, month) => Math.round(Math.min(day * 7, month * 0.38) / 10) * 10
const car = (id, name, brand, cat, seats, year, day, month) => ({ id, name, brand, cat, seats, year, day, week: wk(day, month), month })
export const FLEET = [
  car('corolla', 'Toyota Corolla', 'Toyota', 'economy', 5, 2024, 25, 400),
  car('sonata', 'Hyundai Sonata', 'Hyundai', 'economy', 5, 2024, 30, 550),
  car('sportage', 'Kia Sportage', 'Kia', 'suv', 5, 2024, 35, 650),
  car('patrol', 'Nissan Patrol', 'Nissan', 'suv', 7, 2024, 90, 1700),
  car('raptor', 'Ford Raptor', 'Ford', 'suv', 5, 2023, 130, 2400),
  car('escalade', 'Cadillac Escalade', 'Cadillac', 'luxury', 7, 2024, 160, 2900),
  car('rangerover', 'Range Rover Vogue', 'Range Rover', 'luxury', 5, 2023, 210, 3800),
  car('p911', 'Porsche 911 Carrera', 'Porsche', 'sport', 4, 2024, 300, 5500),
  car('g63', 'Mercedes-AMG G63', 'Mercedes-Benz', 'luxury', 5, 2023, 350, 6500),
  car('bentayga', 'Bentley Bentayga', 'Bentley', 'luxury', 5, 2023, 380, 7000),
  car('urus', 'Lamborghini Urus', 'Lamborghini', 'sport', 5, 2024, 550, 10000),
]
export const BRANDS = [...new Set(FLEET.map((c) => c.brand))]

// the base copy plus the new keys (objects merge, everything else is replaced); ar and de come whole
const merge = (a, b) => { if (!b || typeof b !== 'object' || Array.isArray(b)) return b; const o = { ...a }; for (const k in b) o[k] = a && typeof a[k] === 'object' && !Array.isArray(a[k]) ? merge(a[k], b[k]) : b[k]; return o }
export const STR = { en: merge(BASE.en, ADD.en), ru: merge(BASE.ru, ADD.ru), ar: ADD.ar, de: ADD.de }
