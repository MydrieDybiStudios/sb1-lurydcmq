import { Olympiad } from '../types/olympiad';

export const getPlace = (percentage: number, olympiad: Olympiad): number | null => {
  if (percentage >= (olympiad.first_place_percent ?? 90)) return 1;
  if (percentage >= (olympiad.second_place_percent ?? 75)) return 2;
  if (percentage >= (olympiad.third_place_percent ?? 60)) return 3;
  return null;
};
