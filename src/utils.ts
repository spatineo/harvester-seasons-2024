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
