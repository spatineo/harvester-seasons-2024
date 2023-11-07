/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import add from 'date-fns/add';

interface LayerInfo {
	layer: LayerType,
	url: string
}

interface DimensionType {
	name: string,
	values: string,
};

interface LayerType {
	Name: string,
	Title: string,
	Dimension: DimensionType[]
}

const TIME_DIMENSION_PERIOD_MATCHER = /([0-9-T:Z]+)\/([0-9-T:Z]+)\/(P.*)/

export function parseISODuration(s: any) : Duration {

	// QnD validation of string, need something smarter
	// Should check tokens, order and values
	// e.g. decimals only in smallest unit, W excludes other date parts
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	if (!/^P/.test(s)) return {};

	// Split into parts
	const parts = s.match(/\d+(\.\d+)?[a-z]|T/gi);

	// Flag for date and time parts, used to disambiguate month and minute
	let inDate = true;

	// Map of part tokens to words
	const partMap = {Y:'years',M:'months',W:'weeks',D:'days',h:'hours',m:'minutes',s:'seconds'}

	return parts.reduce((acc, part) => {

		// Set flag if reached a time part
		if (part == 'T') {
			inDate = false;
			return acc;
		}
		
		// Disambiguate time parts (month/minute)
		if (!inDate) {
			part = part.toLowerCase();
		}
		
		// Add part name and value as a number
		acc[partMap[part.slice(-1)]] = +part.slice(0,-1);
		return acc;
	}, {});

}

export function getLatestTimestamp(layerInfo : LayerInfo) : Date | null {
	const values = layerInfo.layer.Dimension.find((d) => d.name === 'time')?.values

	if (!values) {
		window.console.error('No time dimension values in layer', layerInfo);
		return null
	}

	const periodMatch = TIME_DIMENSION_PERIOD_MATCHER.exec(values)
	if (periodMatch) {
		return new Date(periodMatch[2]) // latest date = end of period
	}

	const availableTimestamps = values.split(',').map((timeStr) => new Date(timeStr));

	if (availableTimestamps.length === 0) {
		window.console.error('No values for time dimension in layer', layerInfo);
		return null
	}

	availableTimestamps.sort((a, b) => a.getTime()- b.getTime() );

	return availableTimestamps[availableTimestamps.length-1]
}

export function getNearestTimestamps(layerInfo: LayerInfo, date : Date) : (null | Date)[] | undefined {
	const values = layerInfo.layer.Dimension.find((d) => d.name === 'time')?.values

	if (!values) {
		window.console.error('No time dimension values in layer', layerInfo);
		return;
	}

	const periodMatch = TIME_DIMENSION_PERIOD_MATCHER.exec(values)
	if (periodMatch) {
		const duration = parseISODuration(periodMatch[3])

		let iter = new Date(periodMatch[1]);
		let prev : null | Date = null;
		const last = new Date(periodMatch[2]);

		for (; iter <= last; prev = iter, iter = add(iter, duration)) {
			if (iter === date) {
				return [date, date];
			}
			if (iter >= date) {
				return [prev, iter];
			}
			if (prev !== null && iter <= prev) {
				window.console.error('error in loop, the iterator going the wrong way in time, there is probably something wonky with the duration:', duration)
				return;
			}
		}
		return [prev, null];
	}

	const availableTimestamps = values.split(',').map((timeStr) => new Date(timeStr));

	if (availableTimestamps.length === 0) {
		window.console.error('No values for time dimension in layer', layerInfo);
		return;
	}

	availableTimestamps.sort((a, b) => a.getTime()- b.getTime() );

	for (let i = 0; i < availableTimestamps.length; i++) {
		// Special case: we found the exact timestamp => return the same timestamp as both "previous" and "next"
		if (availableTimestamps[i] == date) {
			return [date, date];
		}

		if (availableTimestamps[i] >= date) {
			return [i > 0 ? availableTimestamps[i-1] : null, availableTimestamps[i]];
		}
	}
	// otherwise, return the last timestamp and null
	return [availableTimestamps[availableTimestamps.length-1], null];
}
