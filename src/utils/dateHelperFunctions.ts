export function oneMonthBack(today: Date) {
  const oneMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, today.getUTCDate()));
  return oneMonth;
}
export function oneMonthForward(today: Date) {
  const oneMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()));
  return oneMonth;
} 

export function tenYearsBack(): Date {
  const newDate = new Date();
  newDate.setUTCFullYear(newDate.getUTCFullYear() - 10);
  newDate.setUTCMonth(0);
  newDate.setUTCDate(1);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

export function tenYearsLater(date: Date) {
  const newDate = new Date(date);
  newDate.setUTCFullYear(newDate.getUTCFullYear() + 9);
  newDate.setUTCMonth(11);
  newDate.setUTCDate(31);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

export function lastDayOfPreviousYear() {
  const today = new Date();
  const lastDay = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
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

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setUTCMonth(date.getUTCMonth() + months, 0);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

export function reduceMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setUTCMonth(date.getUTCMonth() - months, 0);
  newDate.setUTCDate(1)
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}

export function getFirstDayOfTheYear() {
  const today = new Date();
  const startDate = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
  return startDate.toISOString();
}