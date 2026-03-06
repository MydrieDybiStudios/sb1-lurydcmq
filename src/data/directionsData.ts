import { Direction } from '../types/course';

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
  }
];

// Вспомогательная функция для получения названия направления по id
export const getDirectionName = (id: string): string => {
  const direction = directions.find(d => d.id === id);
  return direction ? direction.name : id;
};
