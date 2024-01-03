/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, StartEndTimeSpan, Smartmet, RecordObject } from "../types";

export function oneMonthBack(today: Date) {
  const oneMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDay());
  return oneMonth;
} 

export function oneMonthForward(today: Date) {
  const oneMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDay());
  return oneMonth;
} 

export function addTenYears(date: Date, years: number) {
  const tenYears = new Date(date.setFullYear(date.getFullYear() + years));
  return tenYears;
}

export function lastDayOfPreviousYear(): Date {
  const today = new Date();
  const lastDay = new Date(today.getFullYear() - 1, 11, 31);
  return lastDay;
} 

export function tenYearsBack(date: Date): Date {
  const tenYearsAgo = new Date(date.getFullYear() - 10, 0, 1);
    return tenYearsAgo;
}

export function oneYearsBack(date: Date): Date {
  const tenYearsAgo = new Date(date.getFullYear(), 0, 1);
    return tenYearsAgo;
}

export function oneYearsForward() {
  const date = new Date()
  const oneYear = new Date(date.getFullYear() + 1, date.getMonth(), date.getDay());
    return oneYear;
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

export function getValueFromRedux(value: StartEndTimeSpan): StartEndTimeSpan {
  const startEndTimeSpan = value;
  return startEndTimeSpan;
}

export function asStartEndTimeSpan(value: StartEndTimeSpan): StartEndTimeSpan {
  const startEndTimeSpan = value;
  return startEndTimeSpan;
}

export function getDatesForTimelineDuration(startDate: Date) {
  const result: Date[] = [];
  const currentDate = new Date(startDate.getFullYear(), 0, 1); // January 1st of the given year
  const endDate = new Date(startDate.getFullYear(), 11, 31); // December 31st of the given year

  while (currentDate <= endDate) {
    result.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result;
}

export function marklineStartDate(current: Date) {
  const currentDate = new Date(current);
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate.toISOString().split("T")[0];
}

export function soilTemperatureParams(arr: Parameter[]) {
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
      code: `DIV{SWI2:ECXSF:5062:1:0:0:${i};100}`
    });
  }
  return arr;
}

export function scaleEnsembleData(arr: Smartmet[], smartmet: string) {
  const lastNonNull: RecordObject | undefined = arr.findLast(
    (obj) => obj[smartmet] !== null
  );

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
          const key1 = lastNonNull[key] as number;
          const key2 = lastNonNull[smartmet] as number;
          const currentObjValue = obj[key];
          newObj[key] =
            currentObjValue !== null && lastNonNull !== null
              ? Number(currentObjValue) - (key1 - key2)
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

export function ensembleListSmartIdx(scaledData: Smartmet[], smartmet: string) {
  const ensembleList: string[] = [];
  const smartId: number = scaledData.findLastIndex(
    (obj) => obj[smartmet] !== null
  );
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
          ensembleList.push(key);
        }
      }
    }
  }
  return {
    ensembleList,
    smartId
  };
}

export function harvidx(
  threshold: number,
  datascaled: RecordObject[],
  ensemblelist: Array<string>,
  perturbations: number,
  smartvariable: string
) {
  const resultseries: Array<string | number> = [];
  let agree: number | string = 0;
  let count: number | string = 0;

  for (let k = 0; k < datascaled.length; k++) {
    // No result when smartvariable !== null

    if (
      datascaled[k][smartvariable] !== null ||
      datascaled[k][ensemblelist[0]] == null
    ) {
      
      resultseries[k] = "nan";
    } else {
      let nans = 0;
      // let threshold = 0.4;
      for (let i = 0; i <= perturbations; i++) {
        const value: any = datascaled[k][ensemblelist[i]];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

export function scalingFunction(
  data: RecordObject[],
  ensemblelist: string[],
  smartIdx: number,
  perturbations: number,
  smartvariable1: string,
  smartvariable2?: string
): RecordObject[] {
  const datascaled: RecordObject[] = [];
  for (let i = 0; i < data.length; i++) {
    datascaled[i] = {
      utctime: data[i].utctime,
      [smartvariable1]: data[i][smartvariable1]
    };
    if (smartvariable2 !== undefined) {
      datascaled[i][smartvariable2] = data[i][smartvariable2];
    }
    for (let j = 0; j <= perturbations; j++) {
      if (data[smartIdx] !== undefined) {
        if (
          data[i][ensemblelist[j]] !== null &&
          data[smartIdx][smartvariable1] !== null
        ) {
          const ensembleValue = data[i][ensemblelist[j]]! as number;
          const smartIdxValue = data[smartIdx][ensemblelist[j]]! as number;
          const smartVariable1Value = data[smartIdx][smartvariable1]! as number;
          datascaled[i][ensemblelist[j]] =
            ensembleValue - (smartIdxValue - smartVariable1Value);
        } else {
          datascaled[i][ensemblelist[j]] = null;
        }
      }
    }
  }
  return datascaled;
}

export function ensover(
  threshold: number,
  percent: number,
  datascaled: RecordObject[],
  ensemblelist: string[],
  perturbations: number,
  smartvariable: string
) {
  const resultseries: any = [];
  let agree: number, count: number

  for (let k = 0; k < datascaled.length; k++) {
    // No result when smartvariable !== null
    if (
      datascaled[k][smartvariable] !== null ||
      datascaled[k][ensemblelist[0]] == null
    ) {
      resultseries[k] = "nan";
    } else {
      let nans = (agree = count = 0);
      // let threshold = 0.4;
      for (let i = 0; i <= perturbations; i++) {
        const value: any = datascaled[k][ensemblelist[i]];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (isNaN(value)) {
          nans++;
        } else if (value >= threshold) {
          agree++;
          count++;
        } else {
          count++;
        }
      }
      if (count < nans) {
        resultseries[k] = "nan";
      } else if (agree / count >= percent) {
        resultseries[k] = 2;
      } else if (agree / count <= 1 - percent) {
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

export const checkIfFinnishText = (array: Array<{index: number, data: string}>) => {
  const finalArray: Array<{index: number, data: string}> = []
  const buttonDataEnglish = [
    { index: 1, data: "Soil Carbon in General" },
    { index: 2, data: "Forest Management and Soil Carbon" },
    { index: 3, data: "Peatland vs. Mineral Soil" },
    { index: 4, data: "Carbon Literature" },
  ];
  let hasEmptyData = false; 

  array.forEach((arr: { index: number; data: string }) => {
    if (arr.data === '') {
      hasEmptyData = true; 
    } else {
      finalArray.push({ index: arr.index, data: arr.data });
    }
  });

  if (hasEmptyData) {
    finalArray.push(...buttonDataEnglish);
  }
  return finalArray
}

export const checkIfFinnishTextBody = (array: Array<{index: number, data: string}>) => {
  const finalArray: Array<{index: number, data: string}> = []
  const buttonDataEnglish = [
    { index: 1, data: "Soil Carbon in General" },
    { index: 2, data: "Forest Management and Soil Carbon" },
    { index: 3, data: "Peatland vs. Mineral Soil" },
    { index: 4, data: "Carbon Literature" },
  ];
  let hasEmptyData = false; 

  array.forEach((arr: { index: number; data: string }) => {
    if (arr.data === '') {
      hasEmptyData = true; 
    } else {
      finalArray.push({ index: arr.index, data: arr.data });
    }
  });

  if (hasEmptyData) {
    finalArray.push(...buttonDataEnglish);
  }
  return finalArray
}
