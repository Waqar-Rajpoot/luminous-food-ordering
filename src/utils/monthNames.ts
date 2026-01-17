
export const getMonthName = (monthNumber: number): string => {
  const date = new Date();
  date.setMonth(monthNumber - 1); 
  return date.toLocaleString('en-US', { month: 'long' });
};

export const getAllMonths = (): string[] => {
  return Array.from({ length: 12 }, (_, i) => getMonthName(i + 1));
};