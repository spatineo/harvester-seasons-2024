import { Parameter, StartEndTimeSpan } from './types';

export function addTenYears(date: Date, years: number) {
	date.setFullYear(date.getFullYear() + years);
	return date;
}

export function addSixMonths(date: Date, months: number) {
	const newDate = new Date(date.setMonth(date.getMonth() + months));
	return newDate;
}

export function soilTemperatureCode(arr: Parameter[]) {
	for (let i = 1; i <= 50; i++) {
		arr.push({
			code: `K2C{TSOIL-K:ECBSF:::7:3:${i}}`,
		});
	}
	return arr;
}

export function getValueFromRedux(value: StartEndTimeSpan): StartEndTimeSpan {
	const startEndTimeSpan = value;
	return startEndTimeSpan;
}

export function asStartEndTimeSpan(value: StartEndTimeSpan): StartEndTimeSpan {
	const startEndTimeSpan = value;
	return startEndTimeSpan;
}

export function getDatesForDuration(startDate: Date, duration: number, isMonths: boolean) {
	const result = [];
	const currentDate = new Date(startDate);

	const endDate = new Date(startDate);

	if (isMonths) {
		endDate.setMonth(endDate.getMonth() + duration);
	} else {
		endDate.setMonth(endDate.getMonth() + duration * 12);
	}

	while (currentDate <= endDate) {
		const year = currentDate.getFullYear();
		const month = currentDate.toLocaleString('default', { month: 'short' });
		const day = currentDate.getDate();
		const dateString = `${month} ${day} ${year}`;

		result.push(dateString);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return result;
}
