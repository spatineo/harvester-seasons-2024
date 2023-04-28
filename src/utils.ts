export function addTenYears(date: Date, years: number) {
  date.setFullYear(date.getFullYear() + years);
  return date;
}

export function addSixMonths(date: Date, months: number){
  let newDate = new Date(date.setMonth(date.getMonth()+ months));
  return newDate
}