import { add } from 'date-fns';

export const addMinutes = (minutes: number = 30) => {
  return add(new Date(), { minutes });
};
