'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { pickLocalized } from '@/lib/locale';
import flyarystanLogo from '@/public/flyarystan.png';
import scatLogo from '@/public/scat.png';

const PROHIBITED = {
  ru: ['Взрывоопасные вещества','Сжатые газы (включая аэрозоли)','Легковоспламеняющиеся жидкости','Вещества с высоким содержанием кислорода','Токсичные вещества','Радиоактивные вещества','Разъедающие вещества','Магнитные материалы','Зловонные и раздражающие вещества','Гироскутеры, моноколёса, сегвеи','Электросамокаты на литиевых батареях'],
  kz: ['Жарылғыш заттар','Қысылған газдар (аэрозольдарды қоса)','Тез тұтанатын сұйықтықтар','Оттегі мөлшері жоғары заттар','Улы заттар','Радиоактивті заттар','Тот баситін заттар','Магниттік материалдар','Жағымсыз иісті және тітіркендіргіш заттар','Гироскутерлер, моноциклдер, сегвейлер','Литий батареялы электросамокаттар'],
  en: ['Explosive substances','Compressed gases (including aerosols)','Flammable liquids','Oxygen-rich substances','Toxic substances','Radioactive materials','Corrosive substances','Magnetic materials','Noxious and irritating substances','Hoverboards, unicycles, segways','E-scooters with lithium batteries'],
};

const PREGNANT = {
  ru: ['До 22 недель — обменная карта с указанием срока беременности','22–34 недели (одноплодная) — справка медорганизации + обменная карта','22–32 недели (многоплодная) — справка медорганизации + обменная карта','Свыше 34 (одноплодная) / свыше 32 (многоплодная) — справка 026/у + обменная карта','Не допускаются к перевозке за 7 дней до предполагаемых родов','Роженицы и новорождённые — не ранее 7 дней после рождения'],
  kz: ['22 аптаға дейін — жүктілік мерзімі көрсетілген алмасу карточкасы','22–34 апта (бір ұрықты) — медорганизация анықтамасы + алмасу карточкасы','22–32 апта (көп ұрықты) — медорганизация анықтамасы + алмасу карточкасы','34 аптадан артық (бір) / 32 аптадан артық (көп) — 026/у анықтамасы + карточка','Босанудан 7 күн бұрын тасымалдауға рұқсат берілмейді','Жаңа туған балалар — туғаннан кейін 7 күннен ерте емес'],
  en: ['Up to 22 weeks — exchange card with gestation period','22–34 weeks (singleton) — medical certificate + exchange card','22–32 weeks (multiple) — medical certificate + exchange card','Over 34 (singleton) / over 32 (multiple) — form 026/u + exchange card','Not accepted within 7 days before expected delivery','Newborns — not earlier than 7 days after birth'],
};

const UNACCOMPANIED_CHILDREN = {
  ru: ['Услуга оформляется заранее через авиакомпанию или агентство, где куплен билет.','Возраст, доступность услуги и стоимость зависят от правил конкретной авиакомпании.','Родители/законные представители заполняют необходимые документы на сопровождение.','Ребёнка должен сопровождать взрослый до регистрации и передачи представителю авиакомпании.'],
  kz: ['Қызмет алдын ала авиакомпания немесе билет алынған агенттік арқылы рәсімделеді.','Жасы, қызмет қолжетімділігі және құны нақты авиакомпания ережесіне байланысты.','Ата-аналар/заңды өкілдер сүйемелдеу құжаттарын толтырады.','Баланы тіркеуге және авиакомпания өкіліне тапсырғанға дейін ересек адам алып жүруі тиіс.'],
  en: ['The service must be arranged in advance through the airline or ticket agency.','Age limits, availability and fees depend on the airline rules.','Parents/legal guardians must complete the required escort documents.','An adult must accompany the child until check-in and handover to the airline representative.'],
};

const REDUCED_MOBILITY = {
  ru: ['Сообщите авиакомпании о необходимой помощи заранее, желательно при покупке билета.','В аэропорту может быть предоставлена помощь при регистрации, досмотре, посадке и высадке.','Перевозка кресла-коляски, медицинского оборудования и сопровождающих услуг зависит от правил авиакомпании.','Пассажирам рекомендуется прибывать в аэропорт заранее.'],
  kz: ['Қажетті көмекті авиакомпанияға алдын ала, билет сатып алу кезінде хабарлаған дұрыс.','Әуежайда тіркеу, тексеру, отырғызу және түсіру кезінде көмек көрсетілуі мүмкін.','Арба, медициналық жабдық және сүйемелдеу қызметтері авиакомпания ережесіне байланысты.','Жолаушыларға әуежайға ертерек келу ұсынылады.'],
  en: ['Notify the airline about required assistance in advance, preferably when booking.','Airport assistance may be provided at check-in, security, boarding and disembarkation.','Wheelchair, medical equipment and escort services depend on airline rules.','Passengers are advised to arrive at the airport early.'],
};

const WEAPONS = {
  ru: ['Перевозка оружия и боеприпасов допускается только по предварительному согласованию с авиакомпанией.','Оружие перевозится в разряженном виде, в упаковке/чехле и только при наличии разрешительных документов.','Боеприпасы перевозятся отдельно и с ограничениями по весу и типу.','Пассажир обязан заранее прибыть в аэропорт для оформления и прохождения процедур безопасности.'],
  kz: ['Қару мен оқ-дәріні тасымалдау тек авиакомпаниямен алдын ала келісілген жағдайда рұқсат етіледі.','Қару оқталмаған күйде, қаптамада/қапта және рұқсат құжаттарымен ғана тасымалданады.','Оқ-дәрілер бөлек және салмағы мен түрі бойынша шектеулермен тасымалданады.','Жолаушы рәсімдеу және қауіпсіздік процедуралары үшін әуежайға алдын ала келуі керек.'],
  en: ['Weapons and ammunition may be carried only with prior airline approval.','Weapons must be unloaded, packed/cased and accompanied by valid permits.','Ammunition is carried separately and is subject to weight and type limits.','Passengers must arrive at the airport in advance for formalities and security procedures.'],
};

function getAirlineRules(p) {
  return [
    {
      name: 'FlyArystan',
      logo: flyarystanLogo,
      links: [
        { label: p.airlineLinks.flyarystanHand, href: 'https://flyarystan.com/en/hand-baggage' },
        { label: p.airlineLinks.flyarystanBaggage, href: 'https://flyarystan.com/en/additional-services' },
        { label: p.airlineLinks.flyarystanAnimals, href: 'https://help.airastana.com/hc/en-gb/sections/4417967707410-Animal-transportation' },
      ],
    },
    {
      name: 'SCAT Airlines',
      logo: scatLogo,
      links: [
        { label: p.airlineLinks.scatBaggage, href: 'https://www.scat.kz/en/luggage-and-hand-luggage/luggage/' },
        { label: p.airlineLinks.scatAnimals, href: 'https://www.scat.kz/en/luggage-and-hand-luggage/transportation-of-animals/' },
        { label: p.airlineLinks.scatCategories, href: 'https://www.scat.kz/en/passenger-categories/' },
      ],
    },
  ];
}

function AirlineSourceLinks({ title, links, t }) {
  return (
    <div className="mt-5 border-t border-gray-100 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-28 items-center justify-center rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            aria-label={t.a11y.openAirlineRules.replace('{airline}', link.name)}
          >
            <Image
              src={link.logo}
              alt={link.name}
              width={96}
              height={36}
              className="h-full w-full object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

const RULE_SOURCE_LINKS = {
  handLuggage: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://flyarystan.com/en/hand-baggage' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/luggage-and-hand-luggage/luggage/' },
  ],
  prohibited: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://flyarystan.com/en/hand-baggage' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/luggage-and-hand-luggage/luggage/' },
  ],
  pregnant: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://flyarystan.com/en/additional-services' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/passenger-categories/' },
  ],
  animals: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://help.airastana.com/hc/en-gb/sections/4417967707410-Animal-transportation' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/luggage-and-hand-luggage/transportation-of-animals/' },
  ],
  unaccompaniedChildren: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://flyarystan.com/en/additional-services' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/passenger-categories/' },
  ],
  reducedMobility: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://flyarystan.com/en/additional-services' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/passenger-categories/' },
  ],
  weapons: [
    { name: 'FlyArystan', logo: flyarystanLogo, href: 'https://flyarystan.com/en/hand-baggage' },
    { name: 'SCAT', logo: scatLogo, href: 'https://www.scat.kz/en/luggage-and-hand-luggage/luggage/' },
  ],
};

export default function BaggagePage() {
  const { lang, t } = useLanguage();
  const p = t.pages.baggage;
  const airlineRules = getAirlineRules(p);

  const ANIMALS = {
    ru: [
      '<strong>FlyArystan</strong> разрешает перевозку в салоне кошек, собак и рыбок, черепах <strong>до 8 кг</strong> (PETC).',
      'Птицы и грызуны в салоне и как багаж <strong>не перевозятся</strong>.',
      'Максимальный вес при AVIH — <strong>50 кг</strong>. Минимальный возраст — 3 месяца.',
      '<strong>Документы:</strong> ветеринарный паспорт и ветеринарное свидетельство.',
    ],
    kz: [
      '<strong>FlyArystan</strong> салонда мысықтарды, иттерді, балықтарды, тасбақаларды <strong>8 кг-ға дейін</strong> тасымалдауға рұқсат береді (PETC).',
      'Құстар мен кемірушілер салонда және багаж ретінде <strong>тасымалданбайды</strong>.',
      'AVIH үшін максималды салмақ — <strong>50 кг</strong>. Минималды жасы — 3 ай.',
      '<strong>Құжаттар:</strong> ветеринарлық паспорт және ветеринарлық куәлік.',
    ],
    en: [
      '<strong>FlyArystan</strong> allows cats, dogs, fish and turtles <strong>up to 8 kg</strong> in cabin (PETC).',
      'Birds and rodents are <strong>not allowed</strong> in cabin or as baggage.',
      'Max weight for AVIH — <strong>50 kg</strong>. Minimum age — 3 months.',
      '<strong>Documents required:</strong> vet passport and veterinary certificate.',
    ],
  };

  const STORAGE = {
    ru: ['Расположена на 1 этаже, правая сторона аэропорта','Стоимость: 1 000 тенге с НДС за одно место/сутки','Макс. вес одного места — 30 кг; габариты — 30×50×70 см'],
    kz: ['1-қабатта орналасқан, оң жақ','Бағасы: ҚДС-мен бір орын/тәулік — 1 000 теңге','Бір орынның макс. салмағы — 30 кг; өлшемдері — 30×50×70 см'],
    en: ['Located on the 1st floor, right side of the airport','Price: 1,000 KZT (incl. VAT) per item per day','Max weight per item — 30 kg; dimensions — 30×50×70 cm'],
  };

  const HAND_LUGGAGE = {
    ru: ['Размеры ручной клади зависят от требований авиакомпании.','Нормы провоза багажа определяются купленным тарифом.','За сверхнормативный багаж взимается плата по тарифу перевозчика.'],
    kz: ['Қол жүгінің өлшемдері авиакомпанияның талаптарына байланысты.','Багаж нормасы сатып алынған тарифпен анықталады.','Артық багаж үшін тасымалдаушы тарифі бойынша төлем алынады.'],
    en: ['Carry-on dimensions depend on airline requirements.','Baggage allowance is determined by the purchased fare.','Excess baggage is charged per carrier tariff.'],
  };

  return (
    <>
      <div style={{ backgroundColor: '#001e5c' }} className="text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <a href="/" className="hover:text-white transition-colors">{t.home}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a href="/passengers" className="hover:text-white transition-colors">{t.nav.passengers}</a>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{p.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{p.title}</h1>
          <p className="text-blue-200 mt-2">{p.subtitle}</p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl space-y-6">

          {/* Airline rule sources */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                {p.airlineRules}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {p.airlineRulesHint}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {airlineRules.map((airline) => (
                <div key={airline.name} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                  <a
                    href={airline.links[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 flex h-24 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    aria-label={t.a11y.openAirlineRules.replace('{airline}', airline.name)}
                  >
                    <Image
                      src={airline.logo}
                      alt={airline.name}
                      width={190}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </a>

                  <h3 className="mb-3 text-base font-bold text-gray-900">{airline.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {airline.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 transition hover:border-blue-400 hover:bg-blue-50"
                      >
                        {link.label}
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hand luggage */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              {p.handLuggage}
            </h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              {pickLocalized(HAND_LUGGAGE, lang).map((text, i) => <p key={i}>{text}</p>)}
            </div>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.handLuggage} t={t} />
          </div>

          {/* Prohibited */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              {p.prohibited}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pickLocalized(PROHIBITED, lang).map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.prohibited} t={t} />
          </div>

          {/* Pregnant */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {p.pregnant}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {pickLocalized(PREGNANT, lang).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.pregnant} t={t} />
          </div>

          {/* Animals */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
              {p.animals}
            </h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              {pickLocalized(ANIMALS, lang).map((text, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.animals} t={t} />
          </div>

          {/* Unaccompanied children */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m-4-5l4 5 4-5" />
                </svg>
              </div>
              {p.unaccompaniedChildren}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {pickLocalized(UNACCOMPANIED_CHILDREN, lang).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.unaccompaniedChildren} t={t} />
          </div>

          {/* Reduced mobility */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8a2 2 0 100-4 2 2 0 000 4zm-2 13l1-7-3-1m4-2l3 2 3-1m-7 2l-2 7m2-7h3" />
                </svg>
              </div>
              {p.reducedMobility}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {pickLocalized(REDUCED_MOBILITY, lang).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.reducedMobility} t={t} />
          </div>

          {/* Weapons */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4zm-3 9h6" />
                </svg>
              </div>
              {p.weapons}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {pickLocalized(WEAPONS, lang).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <AirlineSourceLinks title={p.ruleSources} links={RULE_SOURCE_LINKS.weapons} t={t} />
          </div>

          {/* Storage */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              {p.storage}
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {pickLocalized(STORAGE, lang).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
