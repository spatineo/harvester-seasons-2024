/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, StartEndTimeSpan, Smartmet } from "./types";

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
      code: `K2C{TSOIL-K:ECBSF:::7:3:${i}}`
    });
  }
  return arr;
}

export function trafficabilityApiParams() {
  const arr: Parameter[] = [];
  for (let i = 1; i <= 50; i++) {
    arr.push({
      code: `TSOIL-K:ECBSF:::7:3:${i}`
    });
  }
  return arr;
}

export function snowHeightApiParams() {
  const arr: Parameter[] = [];
  for (let i = 1; i <= 50; i++) {
    arr.push({
      code: `HSNOW-M:ECBSF::1:0:3:${i}`
    });
  }
  return arr;
}

export function soilWetnesstApiParams() {
  const arr: Parameter[] = [];
  for (let i = 0; i <= 50; i++) {
    arr.push({
      code: `VSW-M3M3:ECBSF:5022:9:7:0:${i}`
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

export function getDatesForDuration(
  startDate: Date,
  duration: number,
  isMonths: boolean
) {
  const result: (string | Date)[] = [];
  const currentDate = new Date(startDate);
  const endDate = new Date(startDate);
  if (isMonths) {
    endDate.setMonth(endDate.getMonth() + duration);
  } else {
    endDate.setMonth(endDate.getMonth() + duration * 12);
  }

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const day = currentDate.getDate();
    const dateString = `${month} ${day} ${year}`;
    result.push(new Date(dateString));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result;
}

export function setDateTwoDaysAhead() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2);
  return currentDate.toISOString().split("T")[0];
}

export function checkSmartMet(arr: Smartmet[], smartmet: string) {
	let lastNonNull: any = null
	for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    if (obj[smartmet] !== null) {
      lastNonNull = obj;
    } else {
			break;
		}
	}

  const newArr: Smartmet[] = [];
  let foundNonNull = false;

  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];

    if (obj[smartmet] !== null) {
      const smartMetValue = obj[smartmet];
      newArr.push({ utctime: obj.utctime, [smartmet]: smartMetValue });
      foundNonNull = true;
    } else if (foundNonNull || i === 0) {
      const smartmetKey: string | null = smartmet;
      const newObj: Smartmet = { utctime: obj.utctime, [smartmetKey]: null };
      for (const key in obj) {
        if (key === smartmet) {
          newObj[key] = null;
        } else if (key !== "utctime") {
          const currentObjValue = obj[key];
          newObj[key] = currentObjValue !== null ? Number(currentObjValue ) - ( lastNonNull[key] - lastNonNull[smartmet]) : null
        } else {
          newObj[key] = obj[key];
        }
      }
      newArr.push(newObj);
    }
  }
  return newArr;
}
