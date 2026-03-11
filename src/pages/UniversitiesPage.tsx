import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Award, BookOpen, Users, TrendingUp } from 'lucide-react';
import logo from '../logos/logo.png';

// ========== ДАННЫЕ ВУЗОВ (актуальны для поступления в 2026 году) ==========
// Проходные баллы указаны на основе приёма 2025 года (для 2025-2026 учебного года)
// Контрольные цифры приёма (КЦП) на 2026 год будут опубликованы вузами до конца января 2026 [citation:2][citation:5]

interface Specialty {
  name: string;
  subjects: string[];
  minScore?: number | string;    // проходной балл 2025 года (ориентир для 2026)
  budgetPlaces?: number | string; // кол-во бюджетных мест (КЦП 2025 или ожидаемые на 2026)
  paidPlaces?: number | string;   // кол-во платных мест
  price?: number | string;        // стоимость в год (2025)
  notes?: string;                 // доп. информация
}

interface University {
  name: string;
  city: string;
  facts: string[];
  specialties: Specialty[];
  totalBudget?: number | string;
}

const universities: University[] = [
  {
    name: 'Югорский государственный университет (ЮГУ) — Высшая нефтяная школа',
    city: 'Ханты-Мансийск',
    facts: [
      '2-е место в России по трудоустройству в нефтегазовой отрасли',
      '4 базовые кафедры на предприятиях-партнёрах',
      '915+ бюджетных мест на программы высшего образования (520 федеральных + 395 окружных)',
      'Новые программы 2026: Прикладная геология, Нефтегазовая техника, Картография и геоинформатика, Инноватика'
    ],
    totalBudget: 915,
    specialties: [
      {
        name: 'Нефтегазовое дело (21.03.01)',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 150, // проходной балл 2025
        budgetPlaces: 'в составе 915+ бюджетных мест',
        notes: 'Одно из ведущих направлений, высокий спрос'
      },
      {
        name: 'Прикладная геология (21.05.02)',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 145, // проходной балл 2025
        budgetPlaces: 'в составе 915+ бюджетных мест',
        notes: 'Новая специализация по запросу нефтяных компаний'
      },
      {
        name: 'Химия (04.03.01)',
        subjects: ['Русский язык', 'Химия', 'Математика/Биология'],
        minScore: 140, // проходной балл 2025
        budgetPlaces: 'в составе 915+ бюджетных мест'
      }
    ]
  },
  {
    name: 'Сургутский государственный университет (СурГУ)',
    city: 'Сургут',
    facts: [
      'Более 1500 бюджетных мест в 2026 году (705 бакалавриат + 200 специалитет + 410 магистратура)',
      'Медицинский колледж при университете',
      '36 договоров с медорганизациями Югры'
    ],
    totalBudget: 1500,
    specialties: [
      {
        name: 'Информационные системы и технологии',
        subjects: ['Математика', 'Информатика', 'Русский язык'],
        minScore: 170, // проходной балл 2025
        budgetPlaces: 705,
        notes: 'Одно из самых востребованных IT-направлений'
      },
      {
        name: 'Программная инженерия',
        subjects: ['Математика', 'Информатика', 'Русский язык'],
        minScore: 175, // проходной балл 2025
        budgetPlaces: 705
      },
      {
        name: 'Лечебное дело (специалитет)',
        subjects: ['Химия', 'Биология', 'Русский язык'],
        minScore: 200, // проходной балл 2025
        budgetPlaces: 100,
        notes: 'Конкурс до 10 человек на место'
      },
      {
        name: 'Физическая культура и спорт',
        subjects: ['Русский язык', 'Биология', 'Профессиональное испытание'],
        minScore: 160, // проходной балл 2025
        budgetPlaces: 705
      }
    ]
  },
  {
    name: 'Нижневартовский государственный университет (НВГУ)',
    city: 'Нижневартовск',
    facts: [
      '908 бюджетных мест (609 бакалавриат, 225 магистратура, 14 аспирантура)',
      'Колледж НВГУ с новыми нефтяными специальностями'
    ],
    totalBudget: 908,
    specialties: [
      {
        name: 'Нефтегазовое дело (магистратура)',
        subjects: ['Междисциплинарный экзамен'],
        minScore: '—', // в магистратуру по конкурсу портфолио
        budgetPlaces: 225,
        notes: 'Востребованное направление для выпускников бакалавриата'
      },
      {
        name: 'Информатика и вычислительная техника (Искусственный интеллект и машинное обучение)',
        subjects: ['Математика', 'Информатика', 'Русский язык'],
        minScore: 165, // проходной балл 2025
        budgetPlaces: 'новая программа 2026',
        notes: 'Набор впервые, 25 бюджетных мест'
      },
      {
        name: 'Педагогическое образование (дошкольное + логопедия)',
        subjects: ['Обществознание', 'Русский язык', 'Профессиональное испытание'],
        minScore: 150, // проходной балл 2025
        budgetPlaces: 'новая программа 2026',
        notes: 'Набор впервые'
      }
    ]
  },
  {
    name: 'Тюменский индустриальный университет',
    city: 'Тюмень',
    facts: [
      'Один из крупнейших нефтегазовых вузов России',
      '2329 бюджетных мест всего (данные 2025) [citation:5]',
      'Развитая сеть филиалов'
    ],
    totalBudget: 2329,
    specialties: [
      {
        name: 'Нефтегазовое дело',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 180, // проходной балл 2025
        budgetPlaces: 300,
        paidPlaces: 200,
        price: 180000
      },
      {
        name: 'Геология',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 160, // проходной балл 2025
        budgetPlaces: 150,
        paidPlaces: 100,
        price: 170000
      },
      {
        name: 'Химическая технология',
        subjects: ['Математика', 'Химия', 'Русский язык'],
        minScore: 170, // проходной балл 2025
        budgetPlaces: 120,
        paidPlaces: 80,
        price: 165000
      },
      {
        name: 'Теплоэнергетика и теплотехника',
        subjects: ['Математика', 'Русский язык', 'Физика/Химия/Информатика'],
        minScore: 181, // проходной балл 2025 [citation:8]
        budgetPlaces: 28,
        paidPlaces: 166,
        price: 241300
      }
    ]
  },
  {
    name: 'Уфимский государственный нефтяной технический университет',
    city: 'Уфа',
    facts: [
      'Один из старейших нефтяных вузов',
      'Высокий уровень научных разработок'
    ],
    totalBudget: 2100,
    specialties: [
      {
        name: 'Нефтегазовое дело',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 175,
        budgetPlaces: 300,
        paidPlaces: 200,
        price: 170000
      },
      {
        name: 'Химическая технология',
        subjects: ['Математика', 'Химия', 'Русский язык'],
        minScore: 165,
        budgetPlaces: 150,
        paidPlaces: 100,
        price: 160000
      },
      {
        name: 'Энергетика',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 160,
        budgetPlaces: 120,
        paidPlaces: 80,
        price: 155000
      }
    ]
  },
  {
    name: 'Казанский (Приволжский) федеральный университет (Институт геологии и нефтегазовых технологий)',
    city: 'Казань',
    facts: [
      'Ведущий научно-образовательный центр в области геологии и нефтегазового дела'
    ],
    specialties: [
      {
        name: 'Геофизика',
        subjects: ['Математика', 'Русский язык', 'Физика'],
        minScore: 212, // проходной балл 2025
        budgetPlaces: 22,
        paidPlaces: 28,
        price: 169200
      },
      {
        name: 'Геология',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 150,
        budgetPlaces: 45,
        paidPlaces: 30,
        price: 160000
      },
      {
        name: 'Химия',
        subjects: ['Математика', 'Химия', 'Русский язык'],
        minScore: 155,
        budgetPlaces: 30,
        paidPlaces: 20,
        price: 155000
      }
    ]
  },
  {
    name: 'Санкт-Петербургский горный университет',
    city: 'Санкт-Петербург',
    facts: [
      'Первый технический вуз России',
      'Высокий конкурс на нефтегазовые специальности'
    ],
    specialties: [
      {
        name: 'Нефтегазовое дело',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 190,
        budgetPlaces: 100,
        paidPlaces: 50,
        price: 280000
      },
      {
        name: 'Геология',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 170,
        budgetPlaces: 60,
        paidPlaces: 30,
        price: 270000
      }
    ]
  },
  {
    name: 'РГУ нефти и газа (НИУ) имени И.М. Губкина',
    city: 'Москва',
    facts: [
      'Головной нефтегазовый вуз России',
      '1388 бюджетных мест всего [citation:3]'
    ],
    totalBudget: 1388,
    specialties: [
      {
        name: 'Нефтегазовое дело',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 200,
        budgetPlaces: 250,
        paidPlaces: 150,
        price: 320000
      },
      {
        name: 'Химическая технология',
        subjects: ['Математика', 'Химия', 'Русский язык'],
        minScore: 185,
        budgetPlaces: 120,
        paidPlaces: 80,
        price: 300000
      },
      {
        name: 'Энергетика',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 180,
        budgetPlaces: 100,
        paidPlaces: 60,
        price: 295000
      }
    ]
  },
  {
    name: 'Самарский государственный технический университет',
    city: 'Самара',
    facts: [
      'Крупный научно-образовательный центр в Поволжье'
    ],
    specialties: [
      {
        name: 'Нефтегазовое дело',
        subjects: ['Математика', 'Физика', 'Русский язык'],
        minScore: 160,
        budgetPlaces: 120,
        paidPlaces: 80,
        price: 150000
      },
      {
        name: 'Химическая технология',
        subjects: ['Математика', 'Химия', 'Русский язык'],
        minScore: 150,
        budgetPlaces: 90,
        paidPlaces: 60,
        price: 145000
      }
    ]
  },
  {
    name: 'Ижевский государственный технический университет им. М.Т. Калашникова (ИжГТУ)',
    city: 'Ижевск',
    facts: [
      'Готовит специалистов для нефтегазового комплекса Удмуртии и соседних регионов'
    ],
    specialties: [
      {
        name: 'Машины и оборудование нефтяных и газовых промыслов',
        subjects: ['Математика', 'Русский язык', 'Физика/Информатика/Химия'],
        minScore: 145,
        budgetPlaces: 25,
        paidPlaces: 20,
        price: 140000
      },
      {
        name: 'Нефтегазовое дело (Обустройство и эксплуатация нефтяных и газовых промыслов)',
        subjects: ['Математика', 'Русский язык', 'Физика/Информатика/Химия'],
        minScore: 150,
        budgetPlaces: 30,
        paidPlaces: 25,
        price: 145000
      }
    ]
  }
];

// ========== ДАННЫЕ КОЛЛЕДЖЕЙ (СПО) на 2026 год ==========
interface CollegeProgram {
  name: string;
  level: string;
  educationBase: string;
  budgetPlaces?: number | string;
  paidPlaces?: number | string;
  note?: string;
  specialties?: string[];
}

interface College {
  name: string;
  city: string;
  source?: string;
  programs: CollegeProgram[];
}

const colleges: College[] = [
  {
    name: 'Институт нефти и технологий (филиал ЮГУ)',
    city: 'Ханты-Мансийск',
    source: 'Данные приёмной комиссии на 2026',
    programs: [
      {
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений (21.02.01)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '30 + 30',
        note: 'Обычная программа + Профессионалитет'
      },
      {
        name: 'Переработка нефти и газа (18.02.09)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов',
        budgetPlaces: '25 + 25',
        note: 'Обычная программа + Профессионалитет'
      },
      {
        name: 'Электрические станции, сети, их релейная защита и автоматизация (13.02.12)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов',
        budgetPlaces: 30,
        note: 'Профессионалитет'
      }
    ]
  },
  {
    name: 'Колледж Нижневартовского государственного университета (НВГУ)',
    city: 'Нижневартовск',
    source: 'Данные набора 2026',
    programs: [
      {
        name: 'Оператор нефтяных и газовых скважин (21.01.01)',
        level: 'Квалифицированные рабочие',
        educationBase: '9 классов',
        budgetPlaces: 'в составе 60 бюджетных мест',
        note: 'Новая программа 2026 года'
      },
      {
        name: 'Переработка нефти и газа',
        level: 'СПО',
        educationBase: '9 классов',
        budgetPlaces: 'в составе 60 бюджетных мест'
      }
    ]
  },
  {
    name: 'Пермский нефтяной колледж (ГБПОУ "ПНК")',
    city: 'Пермь',
    source: 'Приказ Министерства образования Пермского края от 29.07.2025',
    programs: [
      {
        name: 'Оператор нефтяных и газовых скважин (21.01.01)',
        level: 'Рабочие, служащие',
        educationBase: '9 классов',
        budgetPlaces: 25
      },
      {
        name: 'Разработка и эксплуатация нефтяных и газовых месторождений (21.02.01)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '25 + 25'
      },
      {
        name: 'Техническая эксплуатация и обслуживание роботизированного производства (15.02.18)',
        level: 'Специалисты среднего звена',
        educationBase: '9 классов / 11 классов',
        budgetPlaces: '50 + 25'
      }
    ]
  },
  {
    name: 'Геологический колледж Саратовского государственного университета',
    city: 'Саратов',
    source: 'Каталог колледжей 2026',
    programs: [
      {
        name: 'Сооружение и эксплуатация газонефтепроводов и газонефтехранилищ',
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
  {
    name: 'Сибирский казачий институт технологий и управления (филиал МГУТУ)',
    city: 'Омская область',
    source: 'Каталог колледжей 2026',
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
          Актуальные данные на <strong>11 марта 2026 года</strong>. Проходные баллы указаны по итогам приёма 2025 года — они служат основным ориентиром для поступления в 2026 году [citation:2][citation:5].
        </p>
        <p className="text-center text-sm text-gray-500 mb-6">
          Всего в базе: <strong>{universities.length} вузов</strong> и <strong>{colleges.length} колледжей</strong>
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
              Колледжи ({colleges.length})
            </button>
          </div>
        </div>

        {activeTab === 'universities' && (
          <div className="grid md:grid-cols-2 gap-6">
            {universities.map((uni, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold mb-2">{uni.name}</h3>
                <p className="text-gray-600 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {uni.city}</p>
                
                {uni.facts && (
                  <div className="mb-3 text-sm bg-yellow-50 p-2 rounded">
                    {uni.facts.map((fact, i) => (
                      <p key={i} className="text-yellow-800 flex items-start"><Award className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" /> {fact}</p>
                    ))}
                  </div>
                )}
                
                <h4 className="font-semibold mb-3 flex items-center"><BookOpen className="w-4 h-4 mr-1" /> Специальности:</h4>
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
                      {spec.minScore !== undefined && spec.minScore !== '—' && (
                        <p><span className="text-gray-600">Проходной 2025:</span> <span className="font-bold text-yellow-600">{spec.minScore}</span></p>
                      )}
                      {spec.minScore === '—' && <p className="text-gray-500">Конкурс портфолио</p>}
                      {spec.budgetPlaces && <p><span className="text-gray-600">Бюджетных мест:</span> <span className="font-bold text-green-600">{spec.budgetPlaces}</span></p>}
                      {spec.paidPlaces && <p><span className="text-gray-600">Платных мест:</span> <span className="font-bold text-blue-600">{spec.paidPlaces}</span></p>}
                      {spec.price && <p><span className="text-gray-600">Стоимость:</span> <span className="font-bold">{spec.price} ₽/год</span></p>}
                    </div>
                    {spec.notes && (
                      <p className="text-xs text-gray-600 mt-1 italic">{spec.notes}</p>
                    )}
                  </div>
                ))}
                {uni.totalBudget && (
                  <p className="text-xs text-gray-500 mt-3 border-t pt-2">Всего бюджетных мест в вузе: {uni.totalBudget}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'colleges' && (
          <div className="grid md:grid-cols-2 gap-6">
            {colleges.map((col, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4 border-green-500">
                <h3 className="text-xl font-bold mb-2">{col.name}</h3>
                <p className="text-gray-600 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1" /> {col.city}</p>
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
                      {prog.budgetPlaces && <span>Бюджетных мест: <span className="font-bold text-green-600">{prog.budgetPlaces}</span></span>}
                      {prog.paidPlaces && <span>Платных мест: <span className="font-bold text-blue-600">{prog.paidPlaces}</span></span>}
                    </div>
                    {prog.note && (
                      <p className="text-xs text-gray-600 mt-1 italic">{prog.note}</p>
                    )}
                    {prog.specialties && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Специализации:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prog.specialties.map((spec, j) => (
                            <span key={j} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{spec}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            * Проходные баллы 2026 года станут известны после завершения приёмной кампании (осенью 2026). 
            Указанные баллы — это проходные баллы 2025 года, которые служат основным ориентиром для абитуриентов 2026 года [citation:2][citation:5].
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Контрольные цифры приёма (КЦП) на 2026 год будут опубликованы вузами до конца января 2026 [citation:2][citation:5]. 
            Данные актуализированы на 11 марта 2026.
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
