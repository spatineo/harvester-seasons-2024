export function oneMonthBack(today: Date) {
  const oneMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, today.getUTCDate()));
  return oneMonth;
}
export function oneMonthForward(today: Date) {
  const oneMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()));
  return oneMonth;
} 

export function tenYearsForward(date: Date, years: number) {
  const tenYears = new Date(date.setFullYear(date.getFullYear() + years));
  return tenYears;
}

export function tenYearsBack(date: Date): Date {
  const tenYearsAgo = new Date(date.getFullYear() - 10, 0, 1);
    return tenYearsAgo;
}

export function lastDayOfPreviousYear(): Date {
  const today = new Date();
  const lastDay = new Date(today.getFullYear() - 1, 11, 31);
  return lastDay;
} 

export function oneYearBackward(date: Date): Date {
  const tenYearsAgo = new Date(date.getFullYear(), 0, 1);
    return tenYearsAgo;
}

export function oneYearForward(date: Date) {
  const oneMonth = new Date(Date.UTC(date.getUTCFullYear() + 1, date.getUTCMonth(), date.getUTCDate()));
  return oneMonth;
}

export function addMonths(date: Date, months: number) {
  const newDate = new Date(date.setMonth(date.getMonth() + months));
  return newDate;
}

export function getStartSearchDate() {
  const today = new Date();
  const year = today.getFullYear();
  const startDate = new Date(year, 0, 1);
  startDate.setHours(0, 0, 0, 0);
  return startDate; 
}