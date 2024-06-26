/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, StartEndTimeSpan, Smartmet } from "../types";

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
  endDate: Date | string
) {
  const result: Date[] = [];
  const currentDate = new Date(new Date(startDate));
  const dateEnd = new Date(new Date(endDate));
  while (currentDate <= dateEnd) {
    result.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return result;
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

export function scaleEnsembleData(arr: Smartmet[], parameters: Parameter[]) {
  let ensembleOffset: Map<string, number> | null = null;
  let prevValue: Smartmet | null = null;
  let lastNonEnsembleValue = 0;



  const lastDayOfNonEnsembleValue = arr.findLast((value) => {
    const nonEnsembleParams = parameters.filter(p => !p.ensemble);
    const firstNonNullValue = nonEnsembleParams.find(p => value[p.code] !== null && value[p.code] !== undefined && value[p.code] !== "nan");
    return firstNonNullValue 
  });
 



  return arr.map((value) => {
    // 1) find values for all non-ensemble parameters and add those to ret
    const ret = { utctime: value.utctime };

    let nonEnsembleValueFound = false;
    parameters
      .filter((p) => !p.ensemble)
      .forEach((p) => {
        ret[p.code] = value[p.code];
        if (ret[p.code] !== null && ret[p.code] !== undefined) {
          lastNonEnsembleValue = ret[p.code];
          nonEnsembleValueFound = true;
        }
      });

    if (nonEnsembleValueFound) {
      ensembleOffset = null;
    } else if (ensembleOffset === null && prevValue !== null) {
      // .. calculate offset to each ensemble value
      ensembleOffset = new Map();
      parameters
        .filter((p) => p.ensemble)
        .forEach((p) => {
          if (ensembleOffset !== null) {
            ensembleOffset[p.code] =
              prevValue !== null && prevValue[p.code] - lastNonEnsembleValue;
          }
        });
    }

    parameters
      .filter((p) => p.ensemble)
      .forEach((p) => {
        
        if (nonEnsembleValueFound || value[p.code] === null || value[p.code] === undefined || (lastDayOfNonEnsembleValue && ret.utctime < lastDayOfNonEnsembleValue?.utctime)
        ) {
          // 2) if non-ensemble values found, fill ensemble values with nulls
          ret[p.code] = null;
        } else {
          // 3) if only ensemble values found, scale ensemble values accordingly
          if (ensembleOffset == null) {
            //  .. no scaling can be done, as there is no offset available => use values as is
            ret[p.code] = value[p.code];
          } else {
            ret[p.code] =
              (value[p.code] as number) - (ensembleOffset[p.code] as number);
          }
        }
      });

    prevValue = value;
    return ret;
  });
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

export function ensembleListSmartIDX(data, smartmetString: string) {
  const ensembleListArray: string[] = [];

  let smartmetIdx = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i][smartmetString] !== null) {
        smartmetIdx = i;
    } 
  }

  const foundObject: Record<string, number | string> = data.findLast((obj) => obj[smartmetString] !== null);
    if(foundObject !== undefined) {
      const list = Object.keys(foundObject).filter(key => key !== 'utctime' && key !== smartmetString && key !== "HSNOW-M:CDTE" && key !== "HSNOW-M:CERRA" && key !== "HSNOW-M:EDTE" && key !== "HSNOW-M:ERA5L"
    
      );
      ensembleListArray.push(...list)
    }
  return {
    ensembleListArray,
    smartmetIdx};
}

export function harvidx(
  threshold: number,
  datascaled: Smartmet[],
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  data,
  ensemblelist: string[],
  smartIdx: number,
  perturbations: number,
  smartvariable1: string,
  smartvariable2?: string
): Smartmet[] {
  const datascaled: Smartmet[] = [];
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
  datascaled: Smartmet[],
  ensemblelist: string[],
  perturbations: number,
  smartvariable: string
) {
  const resultseries: any = [];
  let agree: number, count: number;

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
