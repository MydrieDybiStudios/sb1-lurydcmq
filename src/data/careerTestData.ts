// src/data/careerTestData.ts

export interface TestQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    weights: { [key: string]: number };
  }[];
}

export const testQuestions: TestQuestion[] = [
  {
    id: 1,
    question: 'Что тебе больше всего нравится делать?',
    answers: [
      { text: 'Управлять техникой, работать с механизмами', weights: { 'oil-gas': 3, 'energy': 1 } },
      { text: 'Изучать карты, исследовать горные породы', weights: { 'geology': 3, 'oil-gas': 1 } },
      { text: 'Проводить опыты в лаборатории', weights: { 'chemistry': 3, 'ecology': 1 } },
      { text: 'Программировать, разбираться в компьютерах', weights: { 'it': 3 } },
      { text: 'Заботиться о природе, следить за чистотой', weights: { 'ecology': 3 } },
      { text: 'Проектировать электрические схемы', weights: { 'energy': 3, 'it': 1 } }
    ]
  },
  {
    id: 2,
    question: 'Какой школьный предмет тебе нравится больше всего?',
    answers: [
      { text: 'Физика', weights: { 'oil-gas': 2, 'energy': 2, 'it': 1 } },
      { text: 'Химия', weights: { 'chemistry': 3, 'ecology': 1 } },
      { text: 'География', weights: { 'geology': 3, 'ecology': 1 } },
      { text: 'Информатика', weights: { 'it': 3 } },
      { text: 'Биология', weights: { 'ecology': 2, 'chemistry': 1 } },
      { text: 'Математика', weights: { 'oil-gas': 1, 'geology': 1, 'energy': 1, 'it': 1 } }
    ]
  },
  {
    id: 3,
    question: 'Где бы ты хотел работать?',
    answers: [
      { text: 'На современном заводе или нефтеперерабатывающем комплексе', weights: { 'chemistry': 2, 'oil-gas': 2, 'energy': 1 } },
      { text: 'На буровой установке или промысле', weights: { 'oil-gas': 3, 'geology': 2 } },
      { text: 'В научной лаборатории', weights: { 'chemistry': 3, 'geology': 1, 'ecology': 1 } },
      { text: 'В IT-компании или офисе с компьютерами', weights: { 'it': 3 } },
      { text: 'На природе, в экспедициях', weights: { 'geology': 3, 'ecology': 2 } },
      { text: 'На электростанции или энергообъекте', weights: { 'energy': 3 } }
    ]
  },
  {
    id: 4,
    question: 'Какие качества ты в себе ценишь?',
    answers: [
      { text: 'Физическая сила и выносливость', weights: { 'oil-gas': 2, 'geology': 2 } },
      { text: 'Аналитический ум, любовь к расчётам', weights: { 'it': 2, 'energy': 2, 'geology': 1 } },
      { text: 'Внимательность и аккуратность', weights: { 'chemistry': 2, 'ecology': 2 } },
      { text: 'Творческое мышление, изобретательность', weights: { 'chemistry': 1, 'it': 2 } },
      { text: 'Коммуникабельность, умение работать в команде', weights: { 'oil-gas': 1, 'energy': 1, 'geology': 1 } },
      { text: 'Ответственность за безопасность', weights: { 'ecology': 3, 'oil-gas': 1 } }
    ]
  },
  {
    id: 5,
    question: 'Что тебя больше привлекает в будущей профессии?',
    answers: [
      { text: 'Высокий заработок', weights: { 'oil-gas': 2, 'it': 2, 'energy': 1 } },
      { text: 'Возможность путешествовать и работать в разных местах', weights: { 'geology': 3, 'ecology': 1 } },
      { text: 'Работа над сложными технологиями', weights: { 'chemistry': 2, 'it': 2, 'energy': 2 } },
      { text: 'Приносить пользу обществу и природе', weights: { 'ecology': 3 } },
      { text: 'Стабильность и надёжность', weights: { 'oil-gas': 2, 'energy': 2 } },
      { text: 'Научные открытия и исследования', weights: { 'geology': 2, 'chemistry': 2 } }
    ]
  },
  {
    id: 6,
    question: 'Какой тип задач тебе ближе?',
    answers: [
      { text: 'Управлять процессами, контролировать оборудование', weights: { 'oil-gas': 2, 'energy': 2 } },
      { text: 'Исследовать неизвестное, искать закономерности', weights: { 'geology': 2, 'chemistry': 2, 'it': 1 } },
      { text: 'Автоматизировать, писать код', weights: { 'it': 3 } },
      { text: 'Оптимизировать, улучшать существующее', weights: { 'chemistry': 2, 'energy': 2 } },
      { text: 'Обеспечивать безопасность, предотвращать риски', weights: { 'ecology': 3, 'oil-gas': 1 } },
      { text: 'Проектировать новое, придумывать', weights: { 'geology': 1, 'chemistry': 2, 'it': 2 } }
    ]
  },
  {
    id: 7,
    question: 'Как ты предпочитаешь решать проблемы?',
    answers: [
      { text: 'Использую логику и точные расчёты', weights: { 'energy': 2, 'it': 2, 'geology': 1 } },
      { text: 'Пробую разные варианты, экспериментирую', weights: { 'chemistry': 3, 'geology': 1 } },
      { text: 'Изучаю теорию, читаю литературу', weights: { 'geology': 2, 'chemistry': 2 } },
      { text: 'Советуюсь с командой, ищу совместное решение', weights: { 'oil-gas': 2, 'ecology': 2 } },
      { text: 'Полагаюсь на интуицию и опыт', weights: { 'oil-gas': 2, 'geology': 2 } },
      { text: 'Ищу нестандартные подходы', weights: { 'it': 2, 'chemistry': 1, 'energy': 1 } }
    ]
  },
  {
    id: 8,
    question: 'Какая рабочая обстановка тебе комфортнее?',
    answers: [
      { text: 'На свежем воздухе, в любую погоду', weights: { 'geology': 3, 'oil-gas': 2, 'ecology': 1 } },
      { text: 'В офисе с компьютером', weights: { 'it': 3, 'geology': 1 } },
      { text: 'В лаборатории, среди приборов', weights: { 'chemistry': 3, 'ecology': 1 } },
      { text: 'На производстве, среди станков', weights: { 'oil-gas': 2, 'energy': 2 } },
      { text: 'Сменная работа, вахты', weights: { 'oil-gas': 2, 'geology': 2 } },
      { text: 'Стандартный график 5/2', weights: { 'it': 2, 'chemistry': 2, 'energy': 1 } }
    ]
  },
  {
    id: 9,
    question: 'Что для тебя самое важное в работе?',
    answers: [
      { text: 'Результат и достижения', weights: { 'oil-gas': 2, 'energy': 2, 'it': 2 } },
      { text: 'Процесс и возможность учиться новому', weights: { 'geology': 2, 'chemistry': 2 } },
      { text: 'Полезность для общества', weights: { 'ecology': 3 } },
      { text: 'Признание и уважение коллег', weights: { 'oil-gas': 1, 'geology': 1, 'it': 1 } },
      { text: 'Творческая самореализация', weights: { 'it': 2, 'chemistry': 1 } },
      { text: 'Стабильность и уверенность в завтрашнем дне', weights: { 'energy': 2, 'oil-gas': 1 } }
    ]
  },
  {
    id: 10,
    question: 'Какой вклад ты хотел бы внести в нефтегазовую отрасль?',
    answers: [
      { text: 'Добывать больше ресурсов для страны', weights: { 'oil-gas': 3 } },
      { text: 'Открывать новые месторождения', weights: { 'geology': 3 } },
      { text: 'Разрабатывать более эффективные технологии переработки', weights: { 'chemistry': 3 } },
      { text: 'Снижать воздействие на окружающую среду', weights: { 'ecology': 3 } },
      { text: 'Автоматизировать и цифровизовать процессы', weights: { 'it': 3 } },
      { text: 'Обеспечивать энергией города и заводы', weights: { 'energy': 3 } }
    ]
  }
];
