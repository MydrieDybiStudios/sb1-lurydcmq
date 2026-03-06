// src/data/directionsData.ts

export interface Direction {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const directions: Direction[] = [
  {
    id: 'oil-gas',
    name: 'Нефтегазовое дело',
    description: 'Добыча, транспорт и переработка углеводородов',
    icon: '🛢️'
  },
  {
    id: 'geology',
    name: 'Геология и разведка',
    description: 'Поиск и изучение месторождений',
    icon: '⛰️'
  },
  {
    id: 'chemistry',
    name: 'Химическая технология',
    description: 'Химия нефти и газа, нефтехимия',
    icon: '⚗️'
  },
  {
    id: 'energy',
    name: 'Энергетика',
    description: 'Энергообеспечение, альтернативная энергетика',
    icon: '⚡'
  },
  {
    id: 'it',
    name: 'IT в нефтегазовой отрасли',
    description: 'Автоматизация, цифровизация, программирование',
    icon: '💻'
  },
  {
    id: 'ecology',
    name: 'Экология и безопасность',
    description: 'Охрана окружающей среды, промышленная безопасность',
    icon: '🌿'
  }
];
