// Copy for the car page (what opens when a car card is clicked), in the four languages.
// The figures in FLEET (power, 0-100, drive) are typical for each model and are to be confirmed against Richmond's actual cars;
// the rental terms are sample terms. Both are labelled as such on the page.

const sec = (n) => n.toFixed(1)

export const DET = {
  en: {
    home: 'Home', back: 'Back to the fleet', rent: (n) => `Rent ${n} in Dubai`, perDay: 'per day', similar: 'Similar cars', view: 'View',
    rates: { h: (n) => `${n} rental prices`, cols: ['Rental period', 'Per day', 'Example total', 'Saving'], tiers: ['1–6 days', '7–29 days', '30+ days'], days: (n) => `${n} ${n === 1 ? 'day' : 'days'}` },
    badges: ['No deposit', '24/7 support', '24/7 recovery'],
    deposit: 'Deposit', none: 'No deposit',
    book: { h: 'Make a reservation', pickup: 'Pickup date', drop: 'Drop-off date', name: 'Your name', phone: 'Phone number', how: 'How should we reach you?', send: 'Reserve on WhatsApp', or: 'or', chat: 'Chat on WhatsApp', est: (o) => `${o.days} ${o.days === 1 ? 'day' : 'days'}: about ${o.price}, no deposit.`, bad: 'The drop-off date must be after the pickup date.' },
    spec: { h: 'Characteristics', year: 'Year', cls: 'Class', brand: 'Brand', trans: 'Transmission', seats: 'Seats', engine: 'Engine', power: 'Power', acc: '0–100 km/h', top: 'Top speed', drive: 'Drive', fuel: 'Fuel', auto: 'Automatic', petrol: 'Petrol', hp: 'hp', s: 'sec', kmh: 'km/h', note: 'Typical figures for this model; Richmond confirms them for the car you get.' },
    about: { h: (n) => `${n}: what you get`, text: (c, f, d) => `The ${c.year} ${c.name} is a ${c.seats}-seat ${f[c.cat].toLowerCase()} car with ${c.engine} and ${c.hp} hp, ${d.spec.acc} in about ${sec(c.t100)} seconds. ${d.blurb[c.cat]}` },
    blurb: {
      economy: 'It is the sensible choice for getting around Dubai every day: easy to park, easy to drive and easy on the budget, with no deposit to tie up your money.',
      suv: 'Higher seating, more room for people and luggage, and the confidence to leave the city for the desert or the mountains.',
      luxury: 'Quiet, spacious and finished to a higher standard, made for arriving well, whether it is a business meeting or a family weekend.',
      sport: 'Built for people who enjoy driving. The power is there when you want it, and the car is comfortable enough to use every day.',
    },
    uses: {
      economy: [['Daily commute', 'Low running cost and simple to park in busy districts.'], ['A month in Dubai', 'A monthly rate that costs less than most taxi weeks.'], ['Airport runs', 'Room for a family and the bags that go with it.']],
      suv: [['Family weekends', 'Space for everyone and the luggage, with a high view of the road.'], ['Out to the desert', 'Ground clearance and grip for roads that are not smooth.'], ['Longer trips', 'Comfortable on a drive to Abu Dhabi or Fujairah.']],
      luxury: [['Business meetings', 'Arrive in a car that makes the right first impression.'], ['Weddings and events', 'Presence and comfort for the people inside.'], ['Visitors in style', 'Collect guests in the back seat they will remember.']],
      sport: [['A weekend drive', 'Take the coast road with the roads and the sound to enjoy it.'], ['A special occasion', 'Birthdays, proposals, a day you want to remember.'], ['Photos and content', 'A car that looks as good parked as it drives.']],
    },
    uh: 'Where it fits',
    terms: {
      h: 'Rental terms', sample: 'Sample terms for this demo. Richmond confirms the real ones.',
      rows: [['Deposit', 'No deposit'], ['Included mileage', '250 km a day'], ['Extra kilometres', 'AED 10 per km'], ['Delivery', 'Ask us on WhatsApp'], ['Minimum age', '25 years, 2 years of driving']],
      docsH: 'Documents', tourists: 'Visitors', tDocs: 'Passport, visit visa, home-country licence', residents: 'UAE residents', rDocs: 'UAE licence and Emirates ID',
    },
    faq: {
      h: 'Questions about this car',
      items: (c, price, d) => [
        [`What does it cost to rent the ${c.name}?`, `From ${price.day} a day, ${price.week} a week or ${price.month} a month. The longer you rent, the lower the daily price. Prices here are examples; message us for today's rate.`],
        ['Is there a deposit?', 'No. You pay for the rental itself and no deposit is held.'],
        ['What do I need to rent it?', `${d.terms.tourists}: ${d.terms.tDocs.toLowerCase()}. ${d.terms.residents}: ${d.terms.rDocs.toLowerCase()}.`],
        ['What if something goes wrong?', 'Call or message us at any hour. Support is 24/7, and if the car cannot go on we send a recovery truck.'],
      ],
    },
    msg: (o) => `Hello Richmond! I would like to rent ${o.car} from ${o.from} to ${o.to} (${o.days} ${o.days === 1 ? 'day' : 'days'}).${o.name ? ` My name is ${o.name}.` : ''} Phone: ${o.phone}. Please reach me by ${o.how}.`,
  },

  ru: {
    home: 'Главная', back: 'К автопарку', rent: (n) => `Аренда ${n} в Дубае`, perDay: 'в день', similar: 'Похожие автомобили', view: 'Смотреть',
    rates: { h: (n) => `Цены на аренду: ${n}`, cols: ['Срок аренды', 'В день', 'Пример суммы', 'Экономия'], tiers: ['1–6 дней', '7–29 дней', '30+ дней'], days: (n) => `${n} дн.` },
    badges: ['Без депозита', 'Поддержка 24/7', 'Эвакуация 24/7'],
    deposit: 'Депозит', none: 'Без депозита',
    book: { h: 'Забронировать', pickup: 'Дата получения', drop: 'Дата возврата', name: 'Ваше имя', phone: 'Номер телефона', how: 'Как с вами связаться?', send: 'Забронировать в WhatsApp', or: 'или', chat: 'Написать в WhatsApp', est: (o) => `${o.days} дн.: около ${o.price}, без депозита.`, bad: 'Дата возврата должна быть позже даты получения.' },
    spec: { h: 'Характеристики', year: 'Год', cls: 'Класс', brand: 'Марка', trans: 'Коробка', seats: 'Мест', engine: 'Двигатель', power: 'Мощность', acc: '0–100 км/ч', top: 'Макс. скорость', drive: 'Привод', fuel: 'Топливо', auto: 'Автомат', petrol: 'Бензин', hp: 'л.с.', s: 'с', kmh: 'км/ч', note: 'Типичные значения для этой модели; Richmond подтвердит их для вашего автомобиля.' },
    about: { h: (n) => `${n}: что вы получаете`, text: (c, f, d) => `${c.name} ${c.year} года: ${c.seats} мест, ${c.engine}, ${c.hp} л.с., разгон до 100 км/ч примерно за ${sec(c.t100)} с. ${d.blurb[c.cat]}` },
    blurb: {
      economy: 'Разумный выбор для каждодневных поездок по Дубаю: легко припарковать, легко водить и необременительно по бюджету, а депозит ваши деньги не замораживает.',
      suv: 'Высокая посадка, больше места для людей и багажа и уверенность, чтобы выехать из города в пустыню или горы.',
      luxury: 'Тихий, просторный и отделанный на более высоком уровне: чтобы приезжать достойно, будь то деловая встреча или семейные выходные.',
      sport: 'Для тех, кто любит водить. Мощность есть, когда она нужна, а машина достаточно комфортна для каждого дня.',
    },
    uses: {
      economy: [['Ежедневные поездки', 'Низкие расходы и легко парковаться в людных районах.'], ['Месяц в Дубае', 'Месячный тариф обходится дешевле большинства недель на такси.'], ['Поездки в аэропорт', 'Места хватит семье и её чемоданам.']],
      suv: [['Семейные выходные', 'Место для всех и для багажа, высокий обзор дороги.'], ['В пустыню', 'Клиренс и сцепление для неровных дорог.'], ['Дальние поездки', 'Комфортно ехать в Абу-Даби или Фуджейру.']],
      luxury: [['Деловые встречи', 'Приезжайте на машине, которая производит верное первое впечатление.'], ['Свадьбы и события', 'Статус и комфорт для тех, кто внутри.'], ['Встреча гостей', 'Заднее сиденье, которое гости запомнят.']],
      sport: [['Поездка на выходные', 'Приморская дорога и звук, которыми хочется наслаждаться.'], ['Особый случай', 'День рождения, предложение, день, который хочется запомнить.'], ['Фото и контент', 'Машина, которая так же хороша на стоянке, как в движении.']],
    },
    uh: 'Для чего подходит',
    terms: {
      h: 'Условия аренды', sample: 'Условия для демо — примерные. Настоящие подтвердит Richmond.',
      rows: [['Депозит', 'Без депозита'], ['Включённый пробег', '250 км в сутки'], ['Дополнительные километры', '10 AED за км'], ['Доставка', 'Спросите в WhatsApp'], ['Минимальный возраст', '25 лет, стаж 2 года']],
      docsH: 'Документы', tourists: 'Туристы', tDocs: 'Паспорт, въездная виза, национальные права', residents: 'Резиденты ОАЭ', rDocs: 'Права ОАЭ и Emirates ID',
    },
    faq: {
      h: 'Вопросы об этом автомобиле',
      items: (c, price, d) => [
        [`Сколько стоит аренда ${c.name}?`, `От ${price.day} в день, ${price.week} в неделю или ${price.month} в месяц. Чем дольше аренда, тем ниже цена за день. Цены здесь условные; актуальный тариф подскажем в WhatsApp.`],
        ['Нужен ли депозит?', 'Нет. Вы платите только за аренду, депозит не блокируется.'],
        ['Что нужно для аренды?', `${d.terms.tourists}: ${d.terms.tDocs.toLowerCase()}. ${d.terms.residents}: ${d.terms.rDocs.toLowerCase()}.`],
        ['Что если что-то пойдёт не так?', 'Позвоните или напишите в любое время. Поддержка 24/7, и если машина не может ехать, мы пришлём эвакуатор.'],
      ],
    },
    msg: (o) => `Здравствуйте, Richmond! Хочу арендовать ${o.car} с ${o.from} по ${o.to} (${o.days} дн.).${o.name ? ` Меня зовут ${o.name}.` : ''} Телефон: ${o.phone}. Свяжитесь со мной: ${o.how}.`,
  },

  ar: {
    home: 'الرئيسية', back: 'العودة إلى الأسطول', rent: (n) => `استئجار ${n} في دبي`, perDay: 'يومياً', similar: 'سيارات مشابهة', view: 'عرض',
    rates: { h: (n) => `أسعار إيجار ${n}`, cols: ['مدة الإيجار', 'يومياً', 'مثال للإجمالي', 'التوفير'], tiers: ['1–6 أيام', '7–29 يوماً', '30 يوماً فأكثر'], days: (n) => `${n} ${n === 1 ? 'يوم' : 'أيام'}` },
    badges: ['بدون تأمين', 'دعم 24/7', 'سحب 24/7'],
    deposit: 'التأمين', none: 'بدون تأمين',
    book: { h: 'احجز الآن', pickup: 'تاريخ الاستلام', drop: 'تاريخ التسليم', name: 'اسمك', phone: 'رقم الهاتف', how: 'كيف نتواصل معك؟', send: 'احجز عبر واتساب', or: 'أو', chat: 'تحدث عبر واتساب', est: (o) => `${o.days} ${o.days === 1 ? 'يوم' : 'أيام'}: حوالي ${o.price}، بدون تأمين.`, bad: 'يجب أن يكون تاريخ التسليم بعد تاريخ الاستلام.' },
    spec: { h: 'المواصفات', year: 'السنة', cls: 'الفئة', brand: 'الماركة', trans: 'ناقل الحركة', seats: 'المقاعد', engine: 'المحرك', power: 'القوة', acc: '0–100 كم/س', top: 'السرعة القصوى', drive: 'الدفع', fuel: 'الوقود', auto: 'أوتوماتيك', petrol: 'بنزين', hp: 'حصان', s: 'ث', kmh: 'كم/س', note: 'أرقام نموذجية لهذا الطراز؛ تؤكدها Richmond للسيارة التي تستلمها.' },
    about: { h: (n) => `${n}: ما الذي تحصل عليه`, text: (c, f, d) => `${c.name} موديل ${c.year}: ${c.seats} مقاعد، ${c.engine}، ${c.hp} حصاناً، وتصل إلى 100 كم/س في نحو ${sec(c.t100)} ثانية. ${d.blurb[c.cat]}` },
    blurb: {
      economy: 'خيار عملي للتنقل اليومي في دبي: سهلة الركن وسهلة القيادة ومناسبة للميزانية، ولا تحتاج إلى تأمين يجمّد مالك.',
      suv: 'جلسة أعلى ومساحة أكبر للركاب والأمتعة، وثقة للخروج من المدينة إلى الصحراء أو الجبال.',
      luxury: 'هادئة وواسعة ومنتهية بمستوى أعلى، لتصل بأفضل صورة سواء كان اجتماع عمل أو عطلة عائلية.',
      sport: 'صُنعت لمن يحب القيادة. القوة حاضرة عندما تريدها، والسيارة مريحة بما يكفي للاستخدام اليومي.',
    },
    uses: {
      economy: [['التنقل اليومي', 'تكلفة تشغيل منخفضة وسهولة في الركن بالأحياء المزدحمة.'], ['شهر في دبي', 'سعر شهري أقل من معظم أسابيع سيارات الأجرة.'], ['رحلات المطار', 'مساحة تكفي عائلة وحقائبها.']],
      suv: [['عطلات عائلية', 'مساحة للجميع وللأمتعة مع رؤية مرتفعة للطريق.'], ['إلى الصحراء', 'ارتفاع عن الأرض وثبات للطرق غير الممهدة.'], ['رحلات أطول', 'مريحة في الطريق إلى أبوظبي أو الفجيرة.']],
      luxury: [['اجتماعات العمل', 'صل بسيارة تترك الانطباع الأول المناسب.'], ['الأعراس والمناسبات', 'حضور وراحة لمن بداخلها.'], ['استقبال الضيوف', 'مقعد خلفي سيتذكره ضيوفك.']],
      sport: [['رحلة نهاية الأسبوع', 'طريق الساحل مع الصوت والقيادة التي تستحق الاستمتاع.'], ['مناسبة خاصة', 'عيد ميلاد أو طلب زواج أو يوم تريد أن تتذكره.'], ['صور ومحتوى', 'سيارة تبدو رائعة متوقفة كما هي أثناء القيادة.']],
    },
    uh: 'لمن تناسب',
    terms: {
      h: 'شروط الإيجار', sample: 'شروط تجريبية لهذا العرض. تؤكد Richmond الشروط الفعلية.',
      rows: [['التأمين', 'بدون تأمين'], ['المسافة المشمولة', '250 كم يومياً'], ['الكيلومترات الإضافية', '10 دراهم للكم'], ['التوصيل', 'اسألنا عبر واتساب'], ['الحد الأدنى للعمر', '25 سنة وخبرة قيادة سنتان']],
      docsH: 'المستندات', tourists: 'الزوار', tDocs: 'جواز السفر وتأشيرة الزيارة ورخصة بلدك', residents: 'المقيمون في الإمارات', rDocs: 'رخصة الإمارات والهوية الإماراتية',
    },
    faq: {
      h: 'أسئلة عن هذه السيارة',
      items: (c, price, d) => [
        [`كم يكلف استئجار ${c.name}؟`, `من ${price.day} يومياً أو ${price.week} أسبوعياً أو ${price.month} شهرياً. كلما طالت المدة انخفض السعر اليومي. الأسعار هنا أمثلة؛ راسلنا لمعرفة سعر اليوم.`],
        ['هل يوجد تأمين؟', 'لا. تدفع قيمة الإيجار فقط ولا يُحجز أي تأمين.'],
        ['ماذا أحتاج للاستئجار؟', `${d.terms.tourists}: ${d.terms.tDocs}. ${d.terms.residents}: ${d.terms.rDocs}.`],
        ['ماذا لو حدث خطأ ما؟', 'اتصل أو راسلنا في أي ساعة. الدعم على مدار الساعة، وإن تعذّر استمرار الرحلة نرسل شاحنة سحب.'],
      ],
    },
    msg: (o) => `مرحباً Richmond! أرغب في استئجار ${o.car} من ${o.from} إلى ${o.to} (${o.days} ${o.days === 1 ? 'يوم' : 'أيام'}).${o.name ? ` اسمي ${o.name}.` : ''} الهاتف: ${o.phone}. يرجى التواصل معي عبر ${o.how}.`,
  },

  de: {
    home: 'Start', back: 'Zurück zur Flotte', rent: (n) => `${n} in Dubai mieten`, perDay: 'pro Tag', similar: 'Ähnliche Autos', view: 'Ansehen',
    rates: { h: (n) => `Mietpreise ${n}`, cols: ['Mietdauer', 'Pro Tag', 'Beispielsumme', 'Ersparnis'], tiers: ['1–6 Tage', '7–29 Tage', '30+ Tage'], days: (n) => `${n} ${n === 1 ? 'Tag' : 'Tage'}` },
    badges: ['Ohne Kaution', 'Support 24/7', 'Pannenhilfe 24/7'],
    deposit: 'Kaution', none: 'Ohne Kaution',
    book: { h: 'Jetzt reservieren', pickup: 'Abholdatum', drop: 'Rückgabedatum', name: 'Ihr Name', phone: 'Telefonnummer', how: 'Wie erreichen wir Sie?', send: 'Per WhatsApp reservieren', or: 'oder', chat: 'Per WhatsApp chatten', est: (o) => `${o.days} ${o.days === 1 ? 'Tag' : 'Tage'}: etwa ${o.price}, ohne Kaution.`, bad: 'Das Rückgabedatum muss nach dem Abholdatum liegen.' },
    spec: { h: 'Eigenschaften', year: 'Baujahr', cls: 'Klasse', brand: 'Marke', trans: 'Getriebe', seats: 'Sitze', engine: 'Motor', power: 'Leistung', acc: '0–100 km/h', top: 'Höchstgeschwindigkeit', drive: 'Antrieb', fuel: 'Kraftstoff', auto: 'Automatik', petrol: 'Benzin', hp: 'PS', s: 's', kmh: 'km/h', note: 'Typische Werte für dieses Modell; Richmond bestätigt sie für das Auto, das Sie bekommen.' },
    about: { h: (n) => `${n}: Das bekommen Sie`, text: (c, f, d) => `Der ${c.name} (${c.year}): ${c.seats} Sitze, ${c.engine}, ${c.hp} PS, von 0 auf 100 km/h in etwa ${sec(c.t100)} Sekunden. ${d.blurb[c.cat]}` },
    blurb: {
      economy: 'Die vernünftige Wahl für den Alltag in Dubai: leicht zu parken, leicht zu fahren und schonend fürs Budget, ohne Kaution, die Ihr Geld bindet.',
      suv: 'Höhere Sitzposition, mehr Platz für Menschen und Gepäck und die Sicherheit, die Stadt Richtung Wüste oder Berge zu verlassen.',
      luxury: 'Leise, geräumig und hochwertiger verarbeitet: für einen gelungenen Auftritt, ob beim Geschäftstermin oder am Familienwochenende.',
      sport: 'Gebaut für alle, die gern fahren. Die Leistung ist da, wenn Sie sie wollen, und der Wagen ist komfortabel genug für jeden Tag.',
    },
    uses: {
      economy: [['Täglicher Weg', 'Niedrige Kosten und leicht zu parken in belebten Vierteln.'], ['Ein Monat in Dubai', 'Ein Monatspreis, der unter den meisten Taxiwochen liegt.'], ['Flughafenfahrten', 'Platz für eine Familie samt Gepäck.']],
      suv: [['Familienwochenende', 'Platz für alle und das Gepäck, mit hohem Blick auf die Straße.'], ['Raus in die Wüste', 'Bodenfreiheit und Grip für unebene Wege.'], ['Längere Fahrten', 'Komfortabel auf dem Weg nach Abu Dhabi oder Fudschaira.']],
      luxury: [['Geschäftstermine', 'Kommen Sie in einem Auto an, das den richtigen ersten Eindruck macht.'], ['Hochzeiten und Events', 'Auftritt und Komfort für alle im Wagen.'], ['Gäste abholen', 'Ein Rücksitz, an den sich Ihre Gäste erinnern.']],
      sport: [['Wochenendausfahrt', 'Die Küstenstraße, mit Klang und Fahrspaß.'], ['Besonderer Anlass', 'Geburtstag, Antrag, ein Tag, den man nicht vergisst.'], ['Fotos und Content', 'Ein Auto, das geparkt so gut aussieht wie in Fahrt.']],
    },
    uh: 'Wofür es passt',
    terms: {
      h: 'Mietbedingungen', sample: 'Beispielbedingungen für diese Demo. Richmond bestätigt die echten.',
      rows: [['Kaution', 'Ohne Kaution'], ['Inklusive Kilometer', '250 km pro Tag'], ['Zusätzliche Kilometer', 'AED 10 pro km'], ['Lieferung', 'Fragen Sie uns per WhatsApp'], ['Mindestalter', '25 Jahre, 2 Jahre Fahrpraxis']],
      docsH: 'Dokumente', tourists: 'Besucher', tDocs: 'Reisepass, Besuchervisum, Führerschein des Heimatlandes', residents: 'Einwohner der VAE', rDocs: 'VAE-Führerschein und Emirates ID',
    },
    faq: {
      h: 'Fragen zu diesem Auto',
      items: (c, price, d) => [
        [`Was kostet der ${c.name}?`, `Ab ${price.day} pro Tag, ${price.week} pro Woche oder ${price.month} pro Monat. Je länger die Miete, desto niedriger der Tagespreis. Die Preise hier sind Beispiele; schreiben Sie uns für den aktuellen Tarif.`],
        ['Gibt es eine Kaution?', 'Nein. Sie zahlen nur die Miete, es wird keine Kaution einbehalten.'],
        ['Was brauche ich zum Mieten?', `${d.terms.tourists}: ${d.terms.tDocs}. ${d.terms.residents}: ${d.terms.rDocs}.`],
        ['Was, wenn etwas schiefgeht?', 'Rufen Sie uns jederzeit an oder schreiben Sie. Support 24/7, und wenn das Auto nicht weiterfahren kann, schicken wir einen Abschleppwagen.'],
      ],
    },
    msg: (o) => `Hallo Richmond! Ich möchte ${o.car} vom ${o.from} bis ${o.to} mieten (${o.days} ${o.days === 1 ? 'Tag' : 'Tage'}).${o.name ? ` Mein Name ist ${o.name}.` : ''} Telefon: ${o.phone}. Bitte kontaktieren Sie mich per ${o.how}.`,
  },
}
