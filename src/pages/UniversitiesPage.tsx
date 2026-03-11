import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logos/logo.png';

// ========== ДАННЫЕ ВУЗОВ (актуальны на 11 марта 2026) ==========
const universities = [
  {
    name: 'Югорский государственный университет (ЮГУ) — Высшая нефтяная школа',
    city: 'Ханты-Мансийск',
    facts: [
      '2-е место в России по трудоустройству в нефтегазовой отрасли',
      '4 базовые кафедры на предприятиях-партнёрах',
      'Центр карьеры и содействия трудоустройству'
    ],
    specialties: [
      { 
        name: 'Нефтегазовое дело (21.03.01)', 
        subjects: ['Математика', 'Физика', 'Русский язык'], 
        budgetPlaces: 'в составе 915+ бюджетных мест на ВО',
        profile: 'Новые программы: Прикладная геология, Нефтегазовая техника, Картография и геоинформатика, Инноватика [citation:5]'
      },
      { 
        name: 'Прикладная геология (21.05.02)', 
        subjects: ['Математика', 'Физика', 'Русский язык'], 
        budgetPlaces: 'в составе 915+ бюджетных мест на ВО',
        profile: 'Новая специализация по запросу нефтяных компаний'
      },
      { 
        name: 'Химия (04.03.01)', 
        subjects: ['Русский язык', 'Химия', 'Математика/Биология'], 
        budgetPlaces: 'в составе 915+ бюджетных мест на ВО'
      },
    ]
  },
  {
    name: 'Сургутский государственный университет (СурГУ)',
    city: 'Сургут',
    facts: [
      'Более 1500 бюджетных мест в 2026 году [citation:5]',
      'Медицинский колледж при университете',
      '36 договоров с медорганизациями Югры'
    ],
    specialties: [
      { 
        name: 'Информационные системы и технологии', 
        subjects: ['Математика', 'Информатика', 'Русский язык'], 
        budgetPlaces: '705 мест бакалавриат + 200 специалитет + 410 магистратура',
        profile: 'Одно из самых востребованных IT-направлений'
      },
      { 
        name: 'Программная инженерия', 
        subjects: ['Математика', 'Информатика', 'Русский язык'], 
        budgetPlaces: 'в составе бюджетных мест'
      },
      { 
        name: 'Физическая культура и спорт', 
        subjects: ['Русский язык', 'Биология', 'Профессиональное испытание'], 
        budgetPlaces: 'в составе бюджетных мест'
      },
      { 
        name: 'Лечебное дело (специалитет)', 
        subjects: ['Химия', 'Биология', 'Русский язык'], 
        budgetPlaces: '100 мест [citation:5]'
      },
    ]
  },
  {
    name: 'Нижневартовский государственный университет (НВГУ)',
    city: 'Нижневартовск',
    facts: [
      '908 бюджетных мест всего (609 бакалавриат, 225 магистратура, 14 аспирантура) [citation:5]',
      'Колледж НВГУ с новыми нефтяными специальностями'
    ],
    specialties: [
      { 
        name: 'Нефтегазовое дело (магистратура)', 
        subjects: ['Междисциплинарный экзамен'], 
        budgetPlaces: 'в составе 225 мест магистратуры',
        profile: 'Востребованное направление'
      },
      { 
        name: 'Информатика и вычислительная техника (Искусственный интеллект и машинное обучение)', 
        subjects: ['Математика', 'Информатика', 'Русский язык'], 
        budgetPlaces: 'новая программа бакалавриата 2026',
        profile: 'Набор впервые'
      },
      { 
        name: 'Педагогическое образование (дошкольное + логопедия)', 
        subjects: ['Обществознание', 'Русский язык', 'Профессиональное испытание'], 
        budgetPlaces: 'новая программа 2026'
      },
    ]
  },
  {
    name: 'Тюменский индустриальный университет',
    city: 'Тюмень',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 180 },
      { name: 'Геология', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 160 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 170 },
    ]
  },
  {
    name: 'Уфимский государственный нефтяной технический университет',
    city: 'Уфа',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 175 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 165 },
      { name: 'Энергетика', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 160 },
    ]
  },
  {
    name: 'Казанский (Приволжский) федеральный университет (Институт геологии и нефтегазовых технологий)',
    city: 'Казань',
    specialties: [
      { 
        name: 'Геофизика', 
        subjects: ['Математика', 'Русский язык', 'Физика'], 
        minScore: 212,
        budgetPlaces: 22,
        paidPlaces: 28,
        price: 169200
      },
      { name: 'Геология', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 150 },
      { name: 'Химия', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 155 },
    ]
  },
  {
    name: 'Санкт-Петербургский горный университет',
    city: 'Санкт-Петербург',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 190 },
      { name: 'Геология', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 170 },
    ]
  },
  {
    name: 'РГУ нефти и газа (НИУ) имени И.М. Губкина',
    city: 'Москва',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 200 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 185 },
      { name: 'Энергетика', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 180 },
    ]
  },
  {
    name: 'Самарский государственный технический университет',
    city: 'Самара',
    specialties: [
      { name: 'Нефтегазовое дело', subjects: ['Математика', 'Физика', 'Русский язык'], minScore: 160 },
      { name: 'Химическая технология', subjects: ['Математика', 'Химия', 'Русский язык'], minScore: 150 },
    ]
  },
  {
    name: 'Ижевский государственный технический университет им. М.Т. Калашникова (ИжГТУ)',
    city: 'Ижевск',
    specialties: [
      { 
        name: 'Машины и оборудование нефтяных и газовых промыслов', 
        subjects: ['Математика', 'Русский язык', 'Физика/Информатика/Химия'], 
        minScore: '—' 
      },
      { 
        name: 'Нефтегазовое дело (Обустройство и эксплуатация нефтяных и газовых промыслов)', 
        subjects: ['Математика', 'Русский язык', 'Физика/Информатика/Химия'], 
        minScore: '—' 
      },
    ]
  }
];

// ========== ДАННЫЕ КОЛЛЕДЖЕЙ (СПО) на 2026 год ==========
const colleges = [
  // Югра и Тюмень
  {
    name: 'Институт нефти и технологий (филиал ЮГУ)',
    city: 'Ханты-Мансийск',
    source: 'Данные приёмной комиссии на 09.02.2026 [citation:2]',
    programs: [
      { 
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений (21.02.01)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '30 мест (обычная программа) + 30 мест (Профессионалитет)',
        note: 'Факт приёма 2026: средний балл 4.32 и 3.87 соответственно'
      },
      { 
        name: 'Переработка нефти и газа (18.02.09)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов',
        budgetPlaces: '25 мест + 25 мест (Профессионалитет)',
        note: 'Средний балл 4.00 и 4.28'
      },
      { 
        name: 'Электрические станции, сети, их релейная защита и автоматизация (13.02.12)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов',
        budgetPlaces: '30 мест (Профессионалитет)',
        note: 'Средний балл 4.10'
      },
      { 
        name: 'Монтаж, техническое обслуживание, эксплуатация и ремонт промышленного оборудования (15.02.17)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов',
        budgetPlaces: '25 мест (Профессионалитет)',
        note: 'Средний балл 3.97'
      },
      { 
        name: 'Технология аналитического контроля химических соединений (18.02.12)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов',
        budgetPlaces: '15 мест',
        paidPlaces: 10,
        note: 'Средний балл 4.25'
      },
    ]
  },
  {
    name: 'Колледж Нижневартовского государственного университета (НВГУ)',
    city: 'Нижневартовск',
    source: 'Данные набора 2026 [citation:5]',
    programs: [
      {
        name: 'Оператор нефтяных и газовых скважин (21.01.01)',
        level: 'Квалифицированные рабочие',
        educationBase: '9 классов',
        budgetPlaces: 'в составе 60 бюджетных мест колледжа',
        note: 'Новая программа 2026 года: ведение технологического процесса при всех способах добычи'
      },
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'в составе 60 бюджетных мест',
      }
    ]
  },
  {
    name: 'Сургутский медицинский колледж (при СурГУ)',
    city: 'Сургут',
    source: 'Данные приёма 2026 [citation:5]',
    programs: [
      {
        name: 'Сестринское дело',
        level: 'СПО',
        educationBase: '11 классов',
        budgetPlaces: 25,
        note: '30% учебного времени — практика в медорганизациях округа'
      }
    ]
  },
  {
    name: 'Медицинская академия Ханты-Мансийска (факультет среднего медобразования)',
    city: 'Ханты-Мансийск',
    source: 'Данные приёма 2026 [citation:5]',
    programs: [
      {
        name: 'Лечебное дело',
        level: 'СПО',
        educationBase: '11 классов',
        budgetPlaces: 50,
        note: 'Средний балл аттестата в 2025 — 4.62'
      },
      {
        name: 'Сестринское дело',
        level: 'СПО',
        educationBase: '11 классов',
        budgetPlaces: 75
      },
      {
        name: 'Акушерское дело',
        level: 'СПО',
        educationBase: '11 классов',
        budgetPlaces: 25
      },
      {
        name: 'Лабораторная диагностика',
        level: 'СПО',
        educationBase: '11 классов',
        budgetPlaces: 25
      }
    ]
  },

  // Пермский край
  {
    name: 'Пермский нефтяной колледж (ГБПОУ "ПНК")',
    city: 'Пермь',
    source: 'Приказ Министерства образования Пермского края от 29.07.2025 [citation:1]',
    programs: [
      { 
        name: 'Оператор нефтяных и газовых скважин (21.01.01)', 
        level: 'Рабочие, служащие',
        educationBase: '9 классов',
        budgetPlaces: 25
      },
      { 
        name: 'Слесарь-наладчик КИПиА (15.01.37)', 
        level: 'Рабочие, служащие',
        educationBase: '9 классов',
        budgetPlaces: 25
      },
      { 
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений (21.02.01)', 
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '25 (после 9) + 25 (после 11)'
      },
      { 
        name: 'Картография (05.02.01)', 
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '25 (после 9) + 25 (после 11)'
      },
      { 
        name: 'Техническая эксплуатация и обслуживание роботизированного производства (15.02.18)', 
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '50 (после 9) + 25 (после 11)'
      },
    ]
  },

  // Оренбургская область
  {
    name: 'Бугурусланский нефтяной колледж',
    city: 'Бугуруслан, Оренбургская обл.',
    source: 'Данные лицензии на 2026 [citation:8]',
    programs: [
      {
        name: 'Оператор нефтяных и газовых скважин (21.01.01)',
        level: 'Рабочие',
        educationBase: '9 классов',
        budgetPlaces: 'есть',
        note: 'Средний балл аттестата в прошлые годы: 4.1 на бюджет'
      },
      {
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений',
        level: 'Специалисты среднего звена',
        educationBase: '9/11 классов',
        budgetPlaces: 'есть'
      }
    ]
  },
  {
    name: 'Бузулукский строительный колледж',
    city: 'Бузулук, Оренбургская обл.',
    source: 'Данные лицензии на 2026 [citation:8]',
    programs: [
      {
        name: 'Оператор нефтяных и газовых скважин (21.01.01)',
        level: 'Рабочие',
        educationBase: '9 классов',
        budgetPlaces: 'есть',
        note: 'Средний балл аттестата: 4.04 на бюджет'
      }
    ]
  },
  {
    name: 'Ташлинский политехнический техникум',
    city: 'Ташла, Оренбургская обл.',
    source: 'Данные лицензии на 2026 [citation:8]',
    programs: [
      {
        name: 'Оператор нефтяных и газовых скважин (21.01.01)',
        level: 'Рабочие',
        educationBase: '9 классов',
        budgetPlaces: 'есть',
        note: 'Средний балл аттестата: 3.7 на бюджет'
      }
    ]
  },

  // Поволжье
  {
    name: 'Кстовский нефтяной техникум им. Б.И. Корнилова',
    city: 'Кстово, Нижегородская обл.',
    source: 'Данные набора 2026 ожидаются, ориентир на 2025 [citation:4]',
    programs: [
      {
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений',
        level: 'Специалисты среднего звена',
        educationBase: '9/11 классов',
        budgetPlaces: 'информация уточняется'
      },
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9/11 классов',
        budgetPlaces: 'информация уточняется'
      }
    ]
  },

  // Саратов
  {
    name: 'Геологический колледж Саратовского государственного университета',
    city: 'Саратов',
    source: 'Каталог колледжей 2026 [citation:3][citation:7]',
    programs: [
      {
        name: 'Сооружение и эксплуатация газонефтепроводов и газонефтехранилищ',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      },
      {
        name: 'Землеустройство',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      },
      {
        name: 'Геология и разведка нефтяных и газовых месторождений',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      }
    ]
  },

  // Сибирь
  {
    name: 'Сибирский казачий институт технологий и управления (филиал МГУТУ)',
    city: 'Омская область',
    source: 'Каталог колледжей 2026 [citation:3][citation:7]',
    programs: [
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      },
      {
        name: 'Химическая технология производства химических соединений',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      }
    ]
  },
  {
    name: 'Светлинское отделение энергетики, нефти и газа (филиал Регионального технического колледжа)',
    city: 'Светлый, Оренбургская обл.',
    source: 'Каталог колледжей 2026 [citation:7]',
    programs: [
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      },
      {
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      }
    ]
  },

  // Северный Кавказ
  {
    name: 'Колледж Северо-Кавказского горно-металлургического института',
    city: 'Владикавказ',
    source: 'Каталог колледжей 2026 [citation:7]',
    programs: [
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      }
    ]
  },
  {
    name: 'Ингушский политехнический колледж им. Ю.И. Арапиева',
    city: 'Ингушетия',
    source: 'Каталог колледжей 2026 [citation:7]',
    programs: [
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'есть'
      }
    ]
  }
];

const UniversitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'universities' | 'colleges'>('universities');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Югра.Нефть" className="w-10 h-10 rounded-full border-2 border-yellow-400" />
            <h1 className="text-lg md:text-xl font-bold">Вузы, колледжи и ЕГЭ 2026</h1>
          </Link>
          <Link 
            to="/"
            className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-medium py-2 px-4 rounded transition"
          >
            На главную
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-4">Куда поступать после школы?</h2>
        <p className="text-center text-gray-600 mb-2 max-w-2xl mx-auto">
          Актуальные данные на <strong>11 марта 2026 года</strong>: вузы и колледжи нефтегазового профиля, направления подготовки, экзамены ЕГЭ, проходные баллы (ориентировочные) и бюджетные места из официальных источников.
        </p>
        <p className="text-center text-sm text-gray-500 mb-6">
          Всего в базе: <strong>{universities.length} вузов</strong> и <strong>{colleges.length} колледжей/техникумов</strong>
        </p>

        {/* Вкладки ВУЗы / Колледжи */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('universities')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'universities'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Вузы ({universities.length})
            </button>
            <button
              onClick={() => setActiveTab('colleges')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'colleges'
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Колледжи и техникумы ({colleges.length})
            </button>
          </div>
        </div>

        {activeTab === 'universities' && (
          <div className="grid md:grid-cols-2 gap-6">
            {universities.map((uni, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold mb-2">{uni.name}</h3>
                <p className="text-gray-600 mb-2">{uni.city}</p>
                
                {uni.facts && (
                  <div className="mb-3 text-sm bg-yellow-50 p-2 rounded">
                    {uni.facts.map((fact, i) => (
                      <p key={i} className="text-yellow-800">✓ {fact}</p>
                    ))}
                  </div>
                )}
                
                <h4 className="font-semibold mb-3">Специальности бакалавриата / специалитета:</h4>
                {uni.specialties.map((spec, i) => (
                  <div key={i} className="border-t border-gray-100 py-3 first:border-t-0">
                    <p className="font-medium">{spec.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {spec.subjects.map((sub, j) => (
                        <span key={j} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {sub}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm">
                      {spec.minScore && <p>Мин. балл: <span className="font-bold text-yellow-600">{spec.minScore}</span></p>}
                      {spec.budgetPlaces && <p>Бюджетных мест: <span className="font-bold">{spec.budgetPlaces}</span></p>}
                      {spec.paidPlaces && <p>Платных мест: <span className="font-bold">{spec.paidPlaces}</span></p>}
                      {spec.price && <p>Стоимость: <span className="font-bold">{spec.price} ₽/год</span></p>}
                    </div>
                    {spec.profile && (
                      <p className="text-xs text-gray-600 mt-1 italic">{spec.profile}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'colleges' && (
          <div className="grid md:grid-cols-2 gap-6">
            {colleges.map((col, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-2">{col.name}</h3>
                <p className="text-gray-600 mb-1">{col.city}</p>
                {col.source && (
                  <p className="text-xs text-green-600 mb-3">📌 {col.source}</p>
                )}
                
                <h4 className="font-semibold mb-3">Программы СПО 2026:</h4>
                {col.programs.map((prog, i) => (
                  <div key={i} className="border-t border-gray-100 py-3 first:border-t-0">
                    <p className="font-medium">{prog.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{prog.level}</span>
                      <span>База: {prog.educationBase}</span>
                      {prog.budgetPlaces && <span>Бюджетных мест: <span className="font-bold">{prog.budgetPlaces}</span></span>}
                      {prog.paidPlaces && <span>Платных мест: <span className="font-bold">{prog.paidPlaces}</span></span>}
                    </div>
                    {prog.note && (
                      <p className="text-xs text-gray-600 mt-1 italic">{prog.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 col-span-full">
              <p className="text-center text-gray-700">
                🔍 Всего в России более <strong>107 нефтяных колледжей и техникумов</strong>, ведущих приём в 2026 году [<a href="#cite7" className="underline">7</a>]. 
                Из них <strong>26 ссузов</strong> работают при вузах и принимают после 9 класса [<a href="#cite3" className="underline">3</a>].
                Контрольные цифры приёма утверждаются региональными министерствами образования (например, Приказ Минобрнауки Пермского края от 29.07.2025) [<a href="#cite1" className="underline">1</a>].
              </p>
              <p className="text-center text-gray-600 text-sm mt-2">
                Публикация конкурсных списков и зачисление на программы СПО проходят во второй половине августа 2026 [<a href="#cite6" className="underline">6</a>].
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            * Проходные баллы 2026 года появятся после завершения приёмной кампании (осенью 2026). Указаны баллы 2025 года или минимальные ориентиры. 
            Актуальные контрольные цифры приёма (КЦП) и перечни вступительных испытаний публикуются вузами и колледжами в январе-феврале 2026 года.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Данные актуализированы на 11 марта 2026 на основе официальных документов и информации приёмных комиссий [citation:1][citation:2][citation:5].
          </p>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>&copy; 2026 Цифровая образовательная платформа "Югра.Нефть"</p>
      </footer>
    </div>
  );
};

export default UniversitiesPage;
