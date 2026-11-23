// Copy for the header menus, search, brands, offers, price calculator, request form and the two extra languages.
// en and ru hold only the new keys (they are merged into the base copy in i18n.js); ar and de are complete.
// Arabic and German are first drafts: a native speaker should read them before they go in front of a client.

export const ADD = {
  en: {
    nav: { cars: 'Cars', brands: 'Brands', period: 'Rental period', prices: 'Prices', about: 'How it works', contacts: 'Contacts', menu: 'Menu', close: 'Close', language: 'Language', currency: 'Currency' },
    fleet: {
      week: 'Per week', perWeek: '/week', seven: '7 seats', searchPh: 'Search a car or brand', search: 'Search', clear: 'Clear', popular: 'Popular',
      brandsH: 'Brands', none: 'No cars match this search. Clear it, or ask us on WhatsApp.',
      fx: 'AED is pegged at 3.6725 per US dollar; the euro rate is an approximate demo rate.',
    },
    offers: { h: 'Best price in each class', sub: 'The lowest monthly rate in every class of the fleet.', tag: 'Best price', all: 'See all cars' },
    calc: {
      h: 'Price calculator', sub: 'Pick a car and the number of days. The price updates as you type.', car: 'Car', days: 'Days', club: 'Richmond Club price (−10%)',
      perDay: 'Per day', total: 'Total', clubTotal: 'With Club price', book: 'Book this car', note: 'Sample prices, no deposit. The Club price is a concept to be confirmed with Richmond.',
    },
    chauf: { h: 'Need a driver?', p: 'Rent a car with a driver by the day, week or month.', cta: 'Rent a car with a driver', msg: 'Hello Richmond! I would like to rent a car with a driver.' },
    req: {
      h: 'Request a similar car', sub: 'Tell us what you have in mind and how to reach you. We reply within minutes.', name: 'Your name', phone: 'Phone number', how: 'How should we reach you?',
      wa: 'WhatsApp', tg: 'Telegram', call: 'Call', car: 'The car you have in mind', send: 'Send request',
      msg: (o) => `Hello Richmond! Please find me a car like this: ${o.car || 'not decided yet'}. My name is ${o.name}, my number is ${o.phone}. Please reach me by ${o.how}.`,
    },
    float: 'Chat on WhatsApp',
    foot: { cars: 'Cars', brands: 'Brands' },
  },
  ru: {
    nav: { cars: 'Автомобили', brands: 'Марки', period: 'Срок аренды', prices: 'Цены', about: 'Как это работает', contacts: 'Контакты', menu: 'Меню', close: 'Закрыть', language: 'Язык', currency: 'Валюта' },
    fleet: {
      week: 'В неделю', perWeek: '/нед', seven: '7 мест', searchPh: 'Найти авто или марку', search: 'Найти', clear: 'Сбросить', popular: 'Популярное',
      brandsH: 'Марки', none: 'Ничего не найдено. Сбросьте поиск или спросите нас в WhatsApp.',
      fx: 'Дирхам привязан к доллару: 3,6725 за доллар; курс евро приблизительный, для демо.',
    },
    offers: { h: 'Лучшая цена в каждом классе', sub: 'Самый низкий месячный тариф в каждом классе автопарка.', tag: 'Лучшая цена', all: 'Все автомобили' },
    calc: {
      h: 'Калькулятор цены', sub: 'Выберите авто и число дней. Цена пересчитывается сразу.', car: 'Автомобиль', days: 'Дней', club: 'Цена клуба Richmond (−10%)',
      perDay: 'В день', total: 'Итого', clubTotal: 'По цене клуба', book: 'Забронировать это авто', note: 'Цены условные, без депозита. Цена клуба — идея, её нужно согласовать с Richmond.',
    },
    chauf: { h: 'Нужен водитель?', p: 'Аренда авто с водителем на день, неделю или месяц.', cta: 'Авто с водителем', msg: 'Здравствуйте, Richmond! Хочу арендовать автомобиль с водителем.' },
    req: {
      h: 'Заказать похожий автомобиль', sub: 'Напишите, что вы ищете и как с вами связаться. Отвечаем в течение нескольких минут.', name: 'Ваше имя', phone: 'Номер телефона', how: 'Как с вами связаться?',
      wa: 'WhatsApp', tg: 'Telegram', call: 'Звонок', car: 'Какой автомобиль вы ищете', send: 'Отправить запрос',
      msg: (o) => `Здравствуйте, Richmond! Подберите мне автомобиль, похожий на: ${o.car || 'пока не решил(а)'}. Меня зовут ${o.name}, мой номер ${o.phone}. Свяжитесь со мной: ${o.how}.`,
    },
    float: 'Написать в WhatsApp',
    foot: { cars: 'Автомобили', brands: 'Марки' },
  },

  ar: {
    brandSub: 'تأجير سيارات',
    nav: { fleet: 'الأسطول', book: 'الحجز', cta: 'احجز عبر واتساب', cars: 'السيارات', brands: 'الماركات', period: 'مدة الإيجار', prices: 'الأسعار', about: 'كيف نعمل', contacts: 'اتصل بنا', menu: 'القائمة', close: 'إغلاق', language: 'اللغة', currency: 'العملة' },
    loader: 'جارٍ تحميل الفيلم',
    scroll: 'مرّر لتقود',
    skip: 'انتقل إلى الأسطول',
    tabs: { deposit: 'بدون تأمين', recovery: 'سحب 24/7', value: 'من $400', suv: 'دفع رباعي', luxury: 'رياضية وفاخرة' },
    ch: {
      deposit: { a: 'بدون', b: 'تأمين', p: 'رحلتك تبدأ دون دفعة تأمين مقدّمة.' },
      recovery: { a: 'سحب', b: '24/7', p: 'المساعدة دائماً في الطريق.' },
      value: { a: 'من $400', b: 'شهرياً', p: 'اعثر على سيارتك المثالية بسعر استثنائي.' },
      suv: { a: 'مجموعة', b: 'الدفع الرباعي', p: 'اكتشف حرية الانطلاق إلى ما هو أبعد.' },
      luxury: { a: 'رياضية', b: 'وفاخرة', p: 'استمتع بالأداء والأناقة والراحة.' },
    },
    explore: 'تصفّح أسطولنا',
    bookNow: 'احجز سيارتك',
    fleet: {
      h: 'سيارات في متناول الجميع', sub: 'من $400 إلى $10,000 شهرياً، ودون تأمين على أي منها.',
      note: 'الأسطول والأسعار في هذا العرض أمثلة، والصور رسوم توضيحية. الأسعار الدقيقة والتوفر عبر واتساب.',
      day: 'يومياً', week: 'أسبوعياً', month: 'شهرياً', all: 'الكل', economy: 'اقتصادية', suv: 'دفع رباعي', luxury: 'فاخرة', sport: 'رياضية', seven: '7 مقاعد',
      seats: 'مقاعد', perDay: '/يوم', perWeek: '/أسبوع', perMonth: '/شهر', book: 'احجز', count: (n) => `${n} ${n === 1 ? 'سيارة' : 'سيارات'}`,
      searchPh: 'ابحث عن سيارة أو ماركة', search: 'بحث', clear: 'مسح', popular: 'الأكثر طلباً', brandsH: 'الماركات',
      none: 'لا توجد سيارات مطابقة. امسح البحث أو اسألنا عبر واتساب.',
      fx: 'الدرهم مربوط بالدولار عند 3.6725؛ سعر اليورو تقريبي لأغراض العرض.',
      other: { h: 'تبحث عن سيارة أخرى؟', p: 'أخبرنا بالطراز والتواريخ.', cta: 'اسأل عبر واتساب', msg: 'مرحباً Richmond! أبحث عن سيارة غير موجودة في الموقع: ' },
    },
    offers: { h: 'أفضل سعر في كل فئة', sub: 'أقل سعر شهري في كل فئة من الأسطول.', tag: 'أفضل سعر', all: 'عرض كل السيارات' },
    calc: {
      h: 'حاسبة السعر', sub: 'اختر السيارة وعدد الأيام. يتحدّث السعر فوراً.', car: 'السيارة', days: 'الأيام', club: 'سعر نادي Richmond (−10%)',
      perDay: 'يومياً', total: 'الإجمالي', clubTotal: 'بسعر النادي', book: 'احجز هذه السيارة', note: 'أسعار تجريبية وبدون تأمين. سعر النادي فكرة تحتاج إلى اعتماد من Richmond.',
    },
    how: {
      h: 'ثلاث خطوات للمفاتيح',
      steps: [['اختر سيارة', 'من سيارة المدينة الصغيرة إلى أوروس.'], ['راسلنا', 'واتساب أو اتصال. نرد على مدار الساعة، طوال أيام الأسبوع.'], ['وقّع وانطلق', 'تدفع قيمة الإيجار فقط. لا يُحجز أي تأمين.']],
    },
    chauf: { h: 'تحتاج إلى سائق؟', p: 'استأجر سيارة مع سائق ليوم أو أسبوع أو شهر.', cta: 'سيارة مع سائق', msg: 'مرحباً Richmond! أرغب في استئجار سيارة مع سائق.' },
    faq: {
      h: 'قبل أن تحجز', sub: 'هل لديك سؤال آخر؟', ask: 'اسأل عبر واتساب',
      items: [
        ['هل فعلاً لا يوجد تأمين؟', 'نعم. تدفع قيمة الإيجار فقط ولا يُحجز أي مبلغ تأمين.'],
        ['كم تكلفة الشهر؟', 'من $400 إلى $10,000 شهرياً بحسب السيارة. الأسعار في هذه الصفحة أمثلة؛ راسلنا لمعرفة سعر اليوم.'],
        ['ماذا لو تعطلت السيارة؟', 'اتصل أو راسلنا في أي ساعة. الدعم يعمل على مدار الساعة، وإن تعذّر استمرار الرحلة نرسل شاحنة سحب.'],
        ['ماذا أحتاج للاستئجار؟', 'جواز السفر وصفحة التأشيرة أو الهوية الإماراتية ورخصة قيادة سارية في الإمارات. أرسل الصور عبر واتساب ونؤكد قبل حضورك.'],
        ['كيف أحجز؟', 'اختر سيارة وأرسل النموذج أدناه. يفتح واتساب برسالتك جاهزة. أو اتصل بنا.'],
      ],
    },
    req: {
      h: 'اطلب سيارة مشابهة', sub: 'أخبرنا بما تبحث عنه وكيف نتواصل معك. نرد خلال دقائق.', name: 'اسمك', phone: 'رقم الهاتف', how: 'كيف نتواصل معك؟',
      wa: 'واتساب', tg: 'تيليجرام', call: 'اتصال', car: 'السيارة التي تفكر بها', send: 'إرسال الطلب',
      msg: (o) => `مرحباً Richmond! أبحث عن سيارة مشابهة لـ: ${o.car || 'لم أحدد بعد'}. اسمي ${o.name} ورقمي ${o.phone}. يرجى التواصل معي عبر ${o.how}.`,
    },
    book: {
      h: 'احجز سيارتك', sub: 'عبّئ النموذج فيفتح واتساب برسالتك جاهزة للإرسال.',
      car: 'السيارة', any: 'ساعدوني في الاختيار', from: 'تاريخ البدء', period: 'مدة الإيجار', days: 'أيام', name: 'اسمك', send: 'أرسل عبر واتساب', call: 'أو اتصل',
      estimate: (o) => `حوالي ${o.price} لمدة ${o.days} ${o.days === 1 ? 'يوم' : 'أيام'}، بدون تأمين. سعر تجريبي.`,
      msg: (o) => `مرحباً Richmond! أرغب في استئجار ${o.car}${o.date ? ` اعتباراً من ${o.date}` : ''} لمدة ${o.days} ${o.days === 1 ? 'يوم' : 'أيام'}.${o.name ? ` اسمي ${o.name}.` : ''}`,
    },
    float: 'تحدث عبر واتساب',
    foot: {
      tagline: 'سيارات في متناول الجميع.', contact: 'التواصل', site: 'في هذه الصفحة', whatsapp: 'واتساب', call: 'اتصال', how: 'كيف نعمل', faq: 'الأسئلة',
      cars: 'السيارات', brands: 'الماركات',
      rights: 'Richmond لتأجير السيارات، دبي',
      demo: 'موقع تجريبي. صور الأسطول رسوم أنشأها الذكاء الاصطناعي لطرازات السيارات وليست صور سيارات Richmond؛ الأسعار تجريبية؛ والإجابة عن المستندات مثال يجب استبداله بشروط Richmond.',
      credits: 'الفيلم فيديو أنشأه الذكاء الاصطناعي في Google Flow انطلاقاً من صور السيارة. خط Onest (SIL OFL).', insta: 'إنستغرام',
    },
  },

  de: {
    brandSub: 'Autovermietung',
    nav: { fleet: 'Flotte', book: 'Buchung', cta: 'Per WhatsApp buchen', cars: 'Autos', brands: 'Marken', period: 'Mietdauer', prices: 'Preise', about: 'So funktioniert es', contacts: 'Kontakt', menu: 'Menü', close: 'Schließen', language: 'Sprache', currency: 'Währung' },
    loader: 'Film wird geladen',
    scroll: 'Scrollen zum Losfahren',
    skip: 'Direkt zur Flotte',
    tabs: { deposit: 'Ohne Kaution', recovery: 'Pannenhilfe 24/7', value: 'Ab $400', suv: 'SUV', luxury: 'Sport & Luxus' },
    ch: {
      deposit: { a: 'Ohne', b: 'Kaution', p: 'Ihre Reise beginnt ohne Kaution im Voraus.' },
      recovery: { a: 'Pannenhilfe', b: '24/7', p: 'Hilfe ist immer unterwegs.' },
      value: { a: 'Ab $400', b: 'im Monat', p: 'Finden Sie Ihr perfektes Fahrzeug zu einem außergewöhnlichen Preis.' },
      suv: { a: 'SUV', b: 'Kollektion', p: 'Entdecken Sie die Freiheit, über das Gewöhnliche hinauszufahren.' },
      luxury: { a: 'Sport &', b: 'Luxus', p: 'Erleben Sie Leistung, Eleganz und Komfort.' },
    },
    explore: 'Flotte ansehen',
    bookNow: 'Fahrzeug buchen',
    fleet: {
      h: 'Autos, die sich jeder leisten kann', sub: 'Von $400 bis $10.000 im Monat, und bei keinem eine Kaution.',
      note: 'Beispielflotte und Beispielpreise für diese Demo; die Bilder sind Illustrationen. Genaue Preise und Verfügbarkeit per WhatsApp.',
      day: 'Pro Tag', week: 'Pro Woche', month: 'Pro Monat', all: 'Alle', economy: 'Economy', suv: 'SUV', luxury: 'Luxus', sport: 'Sport', seven: '7 Sitze',
      seats: 'Sitze', perDay: '/Tag', perWeek: '/Woche', perMonth: '/Monat', book: 'Buchen', count: (n) => `${n} ${n === 1 ? 'Auto' : 'Autos'}`,
      searchPh: 'Auto oder Marke suchen', search: 'Suchen', clear: 'Zurücksetzen', popular: 'Beliebt', brandsH: 'Marken',
      none: 'Keine passenden Autos. Suche zurücksetzen oder uns per WhatsApp fragen.',
      fx: 'Der Dirham ist mit 3,6725 an den US-Dollar gekoppelt; der Eurokurs ist ein ungefährer Demo-Kurs.',
      other: { h: 'Anderes Auto gesucht?', p: 'Nennen Sie uns Modell und Datum.', cta: 'Per WhatsApp fragen', msg: 'Hallo Richmond! Ich suche ein Auto, das nicht auf der Seite steht: ' },
    },
    offers: { h: 'Bester Preis in jeder Klasse', sub: 'Der niedrigste Monatspreis jeder Klasse der Flotte.', tag: 'Bester Preis', all: 'Alle Autos ansehen' },
    calc: {
      h: 'Preisrechner', sub: 'Auto und Anzahl der Tage wählen. Der Preis aktualisiert sich sofort.', car: 'Auto', days: 'Tage', club: 'Richmond-Club-Preis (−10 %)',
      perDay: 'Pro Tag', total: 'Gesamt', clubTotal: 'Mit Club-Preis', book: 'Dieses Auto buchen', note: 'Beispielpreise, ohne Kaution. Der Club-Preis ist ein Konzept und muss mit Richmond abgestimmt werden.',
    },
    how: {
      h: 'Drei Schritte zum Schlüssel',
      steps: [['Auto wählen', 'Vom Stadtflitzer bis zum Urus.'], ['Schreiben Sie uns', 'WhatsApp oder Anruf. Wir antworten rund um die Uhr, an sieben Tagen die Woche.'], ['Unterschreiben und losfahren', 'Sie zahlen nur die Miete. Es wird keine Kaution einbehalten.']],
    },
    chauf: { h: 'Fahrer gewünscht?', p: 'Mieten Sie ein Auto mit Fahrer für einen Tag, eine Woche oder einen Monat.', cta: 'Auto mit Fahrer mieten', msg: 'Hallo Richmond! Ich möchte ein Auto mit Fahrer mieten.' },
    faq: {
      h: 'Vor der Buchung', sub: 'Noch etwas?', ask: 'Per WhatsApp fragen',
      items: [
        ['Gibt es wirklich keine Kaution?', 'Ja. Sie zahlen nur die Miete, es wird keine Kaution einbehalten.'],
        ['Was kostet ein Monat?', 'Von $400 bis $10.000 im Monat, je nach Auto. Die Preise auf dieser Seite sind Beispiele; schreiben Sie uns für den aktuellen Tarif.'],
        ['Was, wenn das Auto liegen bleibt?', 'Rufen Sie uns jederzeit an oder schreiben Sie. Der Support läuft 24/7, und wenn das Auto nicht weiterfahren kann, schicken wir einen Abschleppwagen.'],
        ['Was brauche ich zum Mieten?', 'Reisepass, Visumseite oder Emirates ID und einen in den VAE gültigen Führerschein. Schicken Sie Fotos per WhatsApp, wir bestätigen vorab.'],
        ['Wie buche ich?', 'Auto wählen und das Formular unten abschicken. WhatsApp öffnet sich mit fertiger Nachricht. Oder rufen Sie einfach an.'],
      ],
    },
    req: {
      h: 'Ähnliches Auto anfragen', sub: 'Sagen Sie uns, was Sie suchen und wie wir Sie erreichen. Wir antworten innerhalb weniger Minuten.', name: 'Ihr Name', phone: 'Telefonnummer', how: 'Wie erreichen wir Sie?',
      wa: 'WhatsApp', tg: 'Telegram', call: 'Anruf', car: 'Das Auto, das Sie sich vorstellen', send: 'Anfrage senden',
      msg: (o) => `Hallo Richmond! Bitte finden Sie ein Auto wie dieses: ${o.car || 'noch nicht entschieden'}. Mein Name ist ${o.name}, meine Nummer ${o.phone}. Bitte kontaktieren Sie mich per ${o.how}.`,
    },
    book: {
      h: 'Fahrzeug buchen', sub: 'Formular ausfüllen, dann öffnet sich WhatsApp mit Ihrer fertigen Nachricht.',
      car: 'Auto', any: 'Hilfe bei der Auswahl', from: 'Startdatum', period: 'Mietdauer', days: 'Tage', name: 'Ihr Name', send: 'Per WhatsApp senden', call: 'Oder anrufen',
      estimate: (o) => `Etwa ${o.price} für ${o.days} ${o.days === 1 ? 'Tag' : 'Tage'}, ohne Kaution. Beispielpreis.`,
      msg: (o) => `Hallo Richmond! Ich möchte ${o.car}${o.date ? ` ab ${o.date}` : ''} für ${o.days} ${o.days === 1 ? 'Tag' : 'Tage'} mieten.${o.name ? ` Mein Name ist ${o.name}.` : ''}`,
    },
    float: 'Per WhatsApp chatten',
    foot: {
      tagline: 'Autos, die sich jeder leisten kann.', contact: 'Kontakt', site: 'Auf dieser Seite', whatsapp: 'WhatsApp', call: 'Anrufen', how: 'So funktioniert es', faq: 'Fragen',
      cars: 'Autos', brands: 'Marken',
      rights: 'Richmond Rent a Car, Dubai',
      demo: 'Konzeptseite. Die Flottenbilder sind KI-Illustrationen der Modelle, keine Fotos von Richmond-Autos; die Preise sind Platzhalter; die Antwort zu den Dokumenten ist ein Beispiel und muss durch Richmonds Bedingungen ersetzt werden.',
      credits: 'Der Film ist KI-generiertes Video, erstellt in Google Flow aus Bildern des Autos. Schrift Onest (SIL OFL).', insta: 'Instagram',
    },
  },
}

export const LANGS = [
  { id: 'en', label: 'En', name: 'English', dir: 'ltr' },
  { id: 'ru', label: 'Рус', name: 'Русский', dir: 'ltr' },
  { id: 'ar', label: 'عربي', name: 'العربية', dir: 'rtl' },
  { id: 'de', label: 'De', name: 'Deutsch', dir: 'ltr' },
]
