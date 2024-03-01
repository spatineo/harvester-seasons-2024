/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphOptions, Smartmet } from "../types";
import { EChartOption } from "echarts";

const param2 = "HARVIDX{0.55;SWI2-0TO1:ECXSF:5062:1:0:0:0-50}";
const param3 = "HARVIDX{273;TSOIL-K:ECBSF:::7:3:1-50;TSOIL-K:ECBSF:::7:1:0}";
const param5 = "HARVIDX{0.55;SWI2-0TO1:EDTE:5068}";
const param7 = "ensover{0.4;0.9;HSNOW-M:SMARTMET:5027}";
const param8 = "ensover{0.4;0.9;HSNOW-M:SMARTOBS:13:4}";

const monthFI = [
  "Tammi",
  "Hel",
  "Maalis",
  "Huhti",
  "Touko",
  "Kesä",
  "Heinä",
  "Elo",
  "Syys",
  "Loka",
  "Marras",
  "Joulu"
];

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const fiFormat = (value: Date) => {
  const date = new Date(value);
  const month = monthFI[date.getMonth()];
  return `${month} {yyyy}`;
};

const enFormat = (value: Date) => {
  const date = new Date(value);
  const month = monthNames[date.getMonth()];
  return `${month} {yyyy}`;
};

export function createTrafficabilityGraphOptions(
  values: (string | number)[][],
  windGustArray: Smartmet[],
  mark,
  languageObject: {
    summerIndex: string;
    winterIndex: string;
    windGust: string;
    winterTenDays: string;
    summerTenDays: string;
  },
  locale: string
) {
  const trafficabilityOptionData: EChartOption = {
    animation: false,
    animationThreshold: 1,
    legend: {},
    grid: {
      show: true,
      left: 46,
      width: "90%"
    },
    tooltip: {
      show: true,
      trigger: "axis"
    },
    yAxis: [
      {
        name: "Traficability",
        nameLocation: "middle",
        min: 0,
        max: 2,
        splitNumber: 1,
        nameTextStyle: {
          padding: 8
        }
      },
      {
        name: "Wind Gust",
        nameLocation: "middle",
        min: 0,
        max: 28,
        splitNumber: 1,
        nameTextStyle: {
          padding: 8
        }
      }
    ],
    xAxis: {
      type: "time",
      splitNumber: 12,
      axisLabel: {
        formatter: locale === "en" ? enFormat : fiFormat,
        fontSize: 10
      }
    },
    series: [
      {
        symbol: "none",
        label: {
          show: false
        },
        type: "line",
        seriesLayoutBy: "row",
        markLine: {
          data: [
            {
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
            color: "#666362"
          }
        }
      },
      {
        name: `${languageObject.summerIndex}`,
        type: "line",
        symbol: "none",
        itemStyle: {
          color: "green"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        areaStyle: {
          color: "rgba(2, 138, 15, 0.5)"
        },

        yAxisIndex: 0,
        data: values.map((t) => {
          return [t[0], t[1]];
        })
      },
      {
        symbol: "none",
        name: `${languageObject.winterIndex}`,
        itemStyle: {
          color: "#0073CF"
        },
        areaStyle: {
          color: "rgba(0,115,207, 0.3)"
        },
        lineStyle: {
          type: "solid",
          width: 1.5
        },

        yAxisIndex: 0,
        type: "line",
        data: values.map((item) => [
          item[0],
          isNaN(Number(item[2])) ? "nan" : item[2]
        ])
      },
      {
        type: "line",
        name: `${languageObject.summerTenDays}`,
        symbol: "none",
        itemStyle: {
          color: "#03241b"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        yAxisIndex: 0,
        data: values.map((item) => [item[0], item[3]])
      },
      {
        type: "line",
        name: `${languageObject.winterTenDays}`,
        symbol: "none",
        itemStyle: {
          color: "#C70039"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        yAxisIndex: 0,
        data: values.map((item) => [item[0], item[4]])
      },
      {
        type: "line",
        name: `${languageObject.windGust}`,
        symbol: "none",
        itemStyle: {
          color: "#BA60FC"
        },
        lineStyle: {
          type: "solid",
          width: 2
        },
        yAxisIndex: 1,
        data: windGustArray.map((item) => {
          const value = Object.values(item);
          return [item.utctime, value[1] === null ? "nan" : value[1]];
        })
      }
    ]
  };
  return trafficabilityOptionData;
}

export function createOptions(
  opts: GraphOptions,
  parameters,
  values,
  mark: string,
  padding: number,
  locale: string,
  toolTipFormatter: (param) => void
) {
  return {
    animation: false,
    animationThreshold: 1,
    grid: {
      width: "auto"
    },
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: toolTipFormatter
    },
    yAxis: {
      name: opts.title,
      nameLocation: "middle",
      nameTextStyle: {
        padding
      }
    },
    xAxis: {
      type: "time",
      splitNumber: 12,
      axisLabel: {
        formatter: locale === "en" ? enFormat : fiFormat,
        fontSize: 10
      }
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
            width: 2,
            color: "green"
          }
        }
      },

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ...parameters.map((p: { code: string }) => {
        const codes = p.code;
        return {
          type: "line",
          symbolSize: 1,
          name: `SH-${codes}`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          data: values.map((d: { utctime: string }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return [d.utctime, d[codes] ? d[codes] : "nan"];
          })
        };
      })
    ]
  };
}

export function calculateTrafficability(
  arr: Smartmet[],
  winterSeries: (number | "nan")[]
) {
  const graphData: any[] = [];
  arr.forEach((t: { utctime: string }, i) => {
    const summer1 = t[param2] !== null ? t[param2] : "nan";
    let winter1: number | "nan";
  
    if (t[param8] !== null) { 
      winter1 = Math.max(t[param3] as number, t[param8] as number); }
    else if (t[param3] !== null || winterSeries[i] !== null && winterSeries.length == arr.length) { 
      winter1 = Math.max(t[param3] as number, winterSeries[i] as number); 
    } else { 
      winter1 = 'nan'; 
    }

    const winterTenDays =
      t[param8] !== null
        ? Math.max(Number(t[param3]), Number(t[param8]))
        : t[param7] !== null
        ? Math.max(Number(t[param7]), Number(t[param3]))
        : "nan";
    const summerTenDays = t[param5] !== null ? t[param5] : "nan";

    graphData.push([
      new Date(t.utctime),
      summer1,
      winter1,
      summerTenDays,
      winterTenDays
    ]);
  });
  return graphData;
}

export function getWindGustParam(arr: Smartmet[]) {
  return arr.map((gust: { utctime: string }) => {
    const keys = Object.keys(gust);
    const foundKeys = keys.find(
      (key) => key !== "utctime" && gust[key] !== null
    );

    if (foundKeys) {
      return {
        utctime: gust.utctime,
        [foundKeys]: gust[foundKeys]
      };
    } else {
      return {
        utctime: gust.utctime,
        [keys[1]]: gust[keys[1]]
      };
    }
  });
}
