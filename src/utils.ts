/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Parameter, StartEndTimeSpan, Smartmet, GraphOptions } from "./types";
import { EChartOption } from "echarts";

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

export function createOptions(
  opts: GraphOptions,
  parameters: Parameter[],
  values: Smartmet[],
  mark: string,
  padding: [number, number, number, number]
) {
  return {
    animation: false,
    animationThreshold: 1,
    grid: {},
    tooltip: {
      trigger: "item"
    },
    yAxis: {
      name: opts.title,
      nameLocation: "middle",
      nameTextStyle: {
        padding
      }
    },
    xAxis: {
      type: "time"
    },
    series: [
      {
        label: {
          show: false
        },
        type: "line",
        seriesLayoutBy: "row",
        markLine: {
          data: [
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              xAxis: mark,
              name: "",
              type: "min",
              label: { show: false }
            }
          ],
          symbol: "none",
          lineStyle: {
            type: "solid",
            width: 3,
            arrow: "none"
          }
        }
      },
      ...parameters.map((p: { code: string }, i: number) => {
        const codes = p.code;
        return {
          type: "line",
          symbolSize: 2,
          name: `SH-${i}`,
          data: values.map(
            (d: { utctime: string; [key: string]: string | number | null }) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return [d.utctime, d[codes]];
            }
          )
        };
      })
    ]
  };
}

export function scaleEnsembleData(arr: Smartmet[], smartmet: string) {
  let lastNonNull: {} | null = null;
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    if (obj[smartmet] !== null) {
      lastNonNull = obj;
    } else {
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

export function createTrafficabilityGraphOptions(parameters: Parameter[], values: [], mark){
  const trafficabilityOptionData: EChartOption = {
    legend: {},
    grid: {
      height: "80px",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      name: "Traficability",
      nameLocation: "middle",
      nameTextStyle: {
        padding: 18,
      },
    },
    xAxis: {
      type: "time",
    },
    series: [
      {
        label: {
          show: false,
        },
        type: "line",
        seriesLayoutBy: "row",
        markLine: {
          data: [
            {
              xAxis: mark,
              name: "",
              type: "min",
              label: { show: false },
            },
          ],
          symbol: "none",
          lineStyle: {
            type: "solid",
            width: 3,
          },
        },
      },
      {
        type: "line",
        name: "winter",
        areaStyle: {
          color: "rgba(0, 12, 0, 0.3)",
        },
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              ...parameters.map((p) => {
                if (t[p.code] !== null && Number(t[p.code]) === 0) {
                  return 0;
                } else if (
                  Number(t[p.code]) > 0.0 &&
                  Number(t[p.code]) <= 0.099999
                ) {
                  return 1;
                } else {
                  return 2;
                }
              }),
            ];
          }),
        ],
      },
      {
        type: "line",
        name: "summer",
        areaStyle: {
          color: "rgba(0, 128, 255, 0.3)",
        },
        data: [
          ...values.map((t: { utctime: string; [key: string]: string }) => {
            return [
              new Date(t.utctime).toISOString(),
              ...parameters.map((p) => {
                if (t[p.code] !== null && Number(t[p.code]) === 0) {
                  return 0.5;
                } else if (
                  Number(t[p.code]) > 0.0 &&
                  Number(t[p.code]) <= 0.099999
                ) {
                  return 1.5;
                } else {
                  return 2;
                }
              }),
            ];
          }),
        ],
      },
    ],
  };
  return trafficabilityOptionData;
};
