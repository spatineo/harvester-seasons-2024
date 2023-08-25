/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, StartEndTimeSpan, Smartmet } from "../types";

export function addTenYears(date: Date, years: number) {
  const tenYears = new Date(date.setFullYear(date.getFullYear() + years));
  return tenYears;
}

export function addMonths(date: Date, months: number) {
  const newDate = new Date(date.setMonth(date.getMonth() + months));
  return newDate;
}

export function getStartSearchDate() {
  const today = new Date();
  const year = today.getFullYear();
  const startDate = new Date(year, 0, 1);
  return startDate;
}

export function marklineStartDate(current: Date) {
  const currentDate = new Date(current);
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate.toISOString().split("T")[0];
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

export function getDatesForTimelineDuration(
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

export function scaleEnsembleData(arr: Smartmet[], smartmet: string) {
  let lastNonNull: {} | null = null;
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    if (obj[smartmet] !== null) {
      lastNonNull = obj;
      break;
    }
  }

  const newArr: Smartmet[] = [];
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];

    if (obj[smartmet] !== null) {
      const smartMetValue = obj[smartmet];
      const newObj = { utctime: obj.utctime };
      Object.keys(obj).forEach((key) => {
        if (key !== "utctime") {
          newObj[key] = smartMetValue;
        }
      });
      newArr.push(newObj);
    } else if (!lastNonNull) {
      newArr.push(obj);
    } else {
      const smartmetKey: string | null = smartmet;
      const newObj: Smartmet = { utctime: obj.utctime, [smartmetKey]: null };
      for (const key in obj) {
        if (key === smartmet) {
          newObj[key] = null;
        } else if (key !== "utctime") {
          const currentObjValue = obj[key];
          newObj[key] =
            currentObjValue !== null && lastNonNull !== null
              ? Number(currentObjValue) -
                (lastNonNull[key] - lastNonNull[smartmet])
              : null;
        } else {
          newObj[key] = obj[key];
        }
      }
      newArr.push(newObj);
    }
  }
  return newArr;
}

export function getOpacityFromPercentage(percentage: number): number {
  if (percentage < 0) {
    return 0;
  } else if (percentage > 100) {
    return 1;
  } else {
    return percentage / 100;
  }
}

export function dataScaled(scaledData: Smartmet[], smartmet: string) {
  const dataSWscaled: number[] = [];
  const foundObject: Smartmet | undefined = scaledData.findLast(
    //"SWVL2-M3M3:SMARTMET:5015"
    (obj) => obj[smartmet] !== null
  );

  const smartmetValue: number | null =
    foundObject !== undefined ? (foundObject[smartmet] as number) : null;
  if (foundObject !== undefined) {
    for (const key in foundObject) {
      if (Object.prototype.hasOwnProperty.call(foundObject, key)) {
        if (key !== smartmet && key !== "utctime" && smartmetValue !== null) {
          if (
            foundObject[key] !== null &&
            typeof foundObject[key] === "number"
          ) {
            const newValue = foundObject[key] as number;
            dataSWscaled.push(newValue - (newValue - smartmetValue));
          }
        }
      }
    }
  }
  return dataSWscaled;
}

export function harvidx(
  threshold: number,
  datascaled: any[],
  ensemblelist: Array<string>,
  perturbations: number,
  smartvariable: string
) {
  const resultseries: Array<string | number> = [];
  let agree: number | string = 0;
  let count: number | string = 0;

  for (let k = 0; k < datascaled.length; k++) {
    // No result when smartvariable !== null
    console.log(datascaled[k][smartvariable], 'datascaled[k][smartvariable] ')
    if (
      datascaled[k][smartvariable] !== null ||
      datascaled[k][ensemblelist[0]] == null
    ) {
      resultseries[k] = "nan";
    } else {
      let nans = 0;
      // let threshold = 0.4;
      for (let i = 0; i <= perturbations; i++) {
        const value: number = datascaled[k][ensemblelist[i]];
        if (isNaN(value)) {
          nans++;
        } else if (value < threshold) {
          agree++;
          count++;
        } else {
          count++;
        }
      }
      if (count < nans) {
        resultseries[k] = "nan";
      } else if (agree / count >= 0.9) {
        resultseries[k] = 2;
      } else if (agree / count <= 0.1) {
        resultseries[k] = 0;
      } else {
        resultseries[k] = 1;
      }
    }
  }
  return resultseries;
}

export function increaseByOneYear(date: Date, years: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

export function decreaseByOneYear(date: Date, years: number) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate;
}
