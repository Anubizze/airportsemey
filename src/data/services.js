/**
 * Airport services. Add photos to `images` when ready:
 * images: [{ src: '/services/cafe-lido-1.webp', alt: { ru: '...', kz: '...', en: '...' } }]
 */
export const AIRPORT_SERVICES = [
  {
    id: 'cafe-lido',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    title: { ru: 'Кафе «Лидо»', kz: '«Лидо» кафесі', en: 'Café Lido' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: {
      ru: 'Горячие блюда, прохладительные напитки, кофе, большой выбор выпечки и закусок.',
      kz: 'Ыстық тағамдар, суық сусындар, кофе, нан-тоқаш пен закускалардың үлкен таңдауы.',
      en: 'Hot meals, cold drinks, coffee, wide selection of pastries and snacks.',
    },
    details: {
      ru: 'Кафе «Лидо» расположено на втором этаже терминала. Здесь можно перекусить до вылета или после прилёта: горячие блюда, кофе, выпечка и прохладительные напитки. Уютная зона для отдыха пассажиров.',
      kz: '«Лидо» кафесі терминалдың 2-қабатында орналасқан. Ұшудан бұрын немесе қонудан кейін тамақтануға болады: ыстық тағамдар, кофе, нан-тоқаш және сусындар. Жолаушыларға арналған ыңғайлы демалыс аймағы.',
      en: 'Café Lido is on the second floor of the terminal. Passengers can enjoy hot meals, coffee, pastries and cold drinks before departure or after arrival in a comfortable seating area.',
    },
    images: [],
  },
  {
    id: 'medical',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: { ru: 'Медицинская часть', kz: 'Медициналық бөлім', en: 'Medical Unit' },
    floor: { ru: '1 этаж, правая сторона', kz: '1-қабат, оң жақ', en: '1st floor, right side' },
    desc: {
      ru: 'Первая медицинская помощь, предполётный контроль экипажа. Тел: 8 (7222) 360-222.',
      kz: 'Алғашқы медициналық көмек, экипаждың ұшу алдындағы бақылауы. Тел: 8 (7222) 360-222.',
      en: 'First aid, pre-flight crew check. Tel: 8 (7222) 360-222.',
    },
    details: {
      ru: 'Медицинская часть оказывает первую помощь пассажирам и проводит предполётный медосмотр экипажей. Обращайтесь при недомогании, травме или необходимости медицинской консультации.',
      kz: 'Медициналық бөлім жолаушыларға алғашқы көмек көрсетеді және экипаждың ұшу алдындағы медициналық тексеруін жүргізеді. Ауру сезімі, жарақат немесе кеңес қажет болғанда хабарласыңыз.',
      en: 'The medical unit provides first aid to passengers and pre-flight medical checks for crew. Contact staff if you feel unwell, are injured or need medical advice.',
    },
    phone: '87222360222',
    images: [],
  },
  {
    id: 'prayer-room',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707',
    title: { ru: 'Намазхана', kz: 'Намазхана', en: 'Prayer Room' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: {
      ru: 'Уединённая комната для молитв, оснащённая всеми необходимыми предметами.',
      kz: 'Барлық қажетті заттармен жабдықталған жеке намаз оқу бөлмесі.',
      en: 'Private prayer room equipped with all necessary items.',
    },
    details: {
      ru: 'Намазхана — тихое пространство для совершения намаза. Комната оборудована всем необходимым для комфортного пребывания.',
      kz: 'Намазхана — намаз оқуға арналған тыныш орын. Бөлме ыңғайлы болу үшін барлық қажетті заттармен жабдықталған.',
      en: 'The prayer room is a quiet space for worship, equipped with everything needed for a comfortable visit.',
    },
    images: [],
  },
  {
    id: 'info-desk',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: { ru: 'Справочное бюро', kz: 'Анықтама бюросы', en: 'Information Desk' },
    floor: { ru: '1 этаж', kz: '1-қабат', en: '1st floor' },
    desc: {
      ru: 'Информация о расписании рейсов и услугах аэропорта. Тел: 8 (7222) 360-222.',
      kz: 'Рейс кестесі және әуежай қызметтері туралы ақпарат. Тел: 8 (7222) 360-222.',
      en: 'Flight schedule and airport services information. Tel: 8 (7222) 360-222.',
    },
    details: {
      ru: 'Сотрудники справочного бюро подскажут расписание рейсов, расположение зон терминала, услуги аэропорта и ответят на другие вопросы пассажиров.',
      kz: 'Анықтама бюросы қызметкерлері рейс кестесін, терминал аймақтарын, әуежай қызметтерін түсіндіреді және жолаушылар сұрақтарына жауап береді.',
      en: 'Information desk staff can help with flight schedules, terminal layout, airport services and other passenger enquiries.',
    },
    phone: '87222360222',
    images: [],
  },
  {
    id: 'ticket-office',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    title: { ru: 'Авиакасса', kz: 'Авиакасса', en: 'Ticket Office' },
    floor: { ru: '1 этаж', kz: '1-қабат', en: '1st floor' },
    desc: {
      ru: 'Касса не работает. Билеты: flyarystan.com, scat.kz. Тел: 8 (7222) 36-02-22.',
      kz: 'Касса жұмыс істемейді. Билеттер: flyarystan.com, scat.kz. Тел: 8 (7222) 36-02-22.',
      en: 'Office closed. Tickets at flyarystan.com, scat.kz. Tel: 8 (7222) 36-02-22.',
    },
    details: {
      ru: 'Авиакасса в терминале не работает. Приобрести билеты можно на официальных сайтах авиакомпаний FlyArystan и SCAT Airlines или по телефону справочной.',
      kz: 'Терминалдағы авиакасса жұмыс істемейді. FlyArystan және SCAT Airlines ресми сайттарынан немесе анықтама телефоны арқылы билет сатып алуға болады.',
      en: 'The ticket office in the terminal is closed. Buy tickets on FlyArystan and SCAT Airlines official websites or via the information phone line.',
    },
    phone: '87222360222',
    links: [
      { label: 'flyarystan.com', href: 'https://flyarystan.com' },
      { label: 'scat.kz', href: 'https://www.scat.kz' },
    ],
    images: [],
  },
  {
    id: 'vip-lounge',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    title: { ru: 'VIP зал', kz: 'VIP залы', en: 'VIP Lounge' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: {
      ru: 'Регистрация, досмотр, трансфер до ВС. Тел: 8 (7222) 36-15-00.',
      kz: 'Тіркелу, тексеру, ұшаққа трансфер. Тел: 8 (7222) 36-15-00.',
      en: 'Check-in, security, aircraft transfer. Tel: 8 (7222) 36-15-00.',
    },
    details: {
      ru: 'VIP зал предлагает комфортное ожидание, индивидуальное обслуживание, регистрацию, досмотр и трансфер до борта воздушного судна. Подробнее — на странице CIP/VIP.',
      kz: 'VIP залы ыңғайлы күту, жеке қызмет, тіркелу, тексеру және ұшаққа трансфер ұсынады. Толығырақ — CIP/VIP бетінде.',
      en: 'The VIP lounge offers comfortable waiting, personal service, check-in, security screening and transfer to the aircraft. See the CIP/VIP page for details.',
    },
    phone: '87222361500',
    href: '/passengers/cip-vip',
    images: [],
  },
  {
    id: 'mother-child',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: { ru: 'Комната матери и ребёнка', kz: 'Ана мен бала бөлмесі', en: 'Mother & Child Room' },
    floor: { ru: '2 этаж', kz: '2-қабат', en: '2nd floor' },
    desc: {
      ru: 'Детская кроватка, пеленальный столик, корзина с игрушками, туалет.',
      kz: 'Балалар керуеті, пелёналау үстелі, ойыншықтар себеті, дәретхана.',
      en: 'Cot, changing table, toy basket, toilet.',
    },
    details: {
      ru: 'Комната матери и ребёнка оборудована для комфортного ухода за малышом: кроватка, пеленальный стол, игрушки и санузел. Пространство предназначено для семей с детьми.',
      kz: 'Ана мен бала бөлмесі сәбиге күтім жасауға ыңғайлы: керует, пелёналау үстелі, ойыншықтар және дәретхана. Отбасыларға арналған.',
      en: 'The mother and child room is equipped for caring for infants: cot, changing table, toys and toilet. A dedicated space for families travelling with children.',
    },
    images: [],
  },
  {
    id: 'left-luggage',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    title: { ru: 'Камера хранения', kz: 'Заттарды сақтау', en: 'Left Luggage' },
    floor: { ru: '1 этаж, правая сторона', kz: '1-қабат, оң жақ', en: '1st floor, right side' },
    desc: {
      ru: 'Хранение багажа. 1 000 тенге/сутки. Макс. вес — 30 кг.',
      kz: 'Жүк сақтау. 1 000 теңге/тәулік. Макс. салмақ — 30 кг.',
      en: 'Luggage storage. 1,000 KZT/day. Max weight — 30 kg.',
    },
    details: {
      ru: 'Камера хранения принимает багаж и личные вещи. Стоимость — 1 000 тенге в сутки за одно место, максимальный вес — 30 кг, габариты — до 30×50×70 см.',
      kz: 'Заттарды сақтау бөлмесі жүк пен жеке заттарды қабылдайды. Бағасы — бір орын/тәулік 1 000 теңге, макс. салмағы — 30 кг, өлшемі — 30×50×70 см дейін.',
      en: 'Left luggage accepts bags and personal items. Rate: 1,000 KZT per item per day, max weight 30 kg, max size 30×50×70 cm.',
    },
    images: [],
  },
  {
    id: 'mobility',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: { ru: 'Помощь маломобильным', kz: 'Мобильдігі шектеулілерге көмек', en: 'Mobility Assistance' },
    floor: { ru: 'Весь терминал', kz: 'Бүкіл терминал', en: 'Entire terminal' },
    desc: {
      ru: 'Инвалидные коляски, амбулифт. Заявка за 5 дней. Тел: 8 (7222) 360-222.',
      kz: 'Инвалидті арбалар, амбулифт. 5 күн бұрын өтініш. Тел: 8 (7222) 360-222.',
      en: 'Wheelchairs, ambulift. Request 5 days in advance. Tel: 8 (7222) 360-222.',
    },
    details: {
      ru: 'Служба помощи маломобильным пассажирам предоставляет инвалидные коляски и амбулифт. Рекомендуем подать заявку за 5 дней до вылета через справочную.',
      kz: 'Мобильділігі шектеулі жолаушыларға арба мен амбулифт ұсынылады. Ұшудан 5 күн бұрын анықтама арқылы өтініш беру ұсынылады.',
      en: 'Mobility assistance provides wheelchairs and ambulift. We recommend requesting service at least 5 days before departure via the information desk.',
    },
    phone: '87222360222',
    images: [],
  },
  {
    id: 'police',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: { ru: 'ЛОВД (Полиция)', kz: 'ЛМАБ (Полиция)', en: 'Airport Police' },
    floor: { ru: '1 этаж', kz: '1-қабат', en: '1st floor' },
    desc: {
      ru: 'Общественный порядок, проверка документов. Обращайтесь при утере документов.',
      kz: 'Қоғамдық тәртіп, құжаттарды тексеру. Құжаттар жоғалса хабарласыңыз.',
      en: 'Public order, document verification. Contact if documents are lost.',
    },
    details: {
      ru: 'Линейный отдел полиции на территории аэропорта обеспечивает общественный порядок и проверку документов. Обратитесь при утере документов или других происшествиях.',
      kz: 'Әуежайдағы полиция бөлімі қоғамдық тәртіп пен құжаттарды тексеруді қамтамасыз етеді. Құжаттар жоғалғанда немесе басқа жағдайларда хабарласыңыз.',
      en: 'Airport police maintain public order and verify documents. Contact them if you lose documents or need assistance.',
    },
    images: [],
  },
];
